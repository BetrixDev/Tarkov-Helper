import "reflect-metadata";
import dayjs from "dayjs";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { container } from "tsyringe";
import { translation } from "../language";
import { config } from "../../config";
import { TarkovDataService } from "../../services/TarkovDataService";
import { TarkovLocaleService } from "../../services/TarkovLocaleService";
import { LanguageCode } from "../../typings/common";
import { MapImageData } from "../../typings/services/TarkovDataService";
import { MapBoss, TarkovDevMap } from "../../typings/tarkov.dev/TarkovDevMap";

interface BossData {
    name: string;
    chance?: number;
}

export class Location {
    private dataService = container.resolve(TarkovDataService);
    private localService = container.resolve(TarkovLocaleService);

    private language: LanguageCode;
    private bosses: MapBoss[];

    name: string;
    nameId: string;
    normalizedName: string;
    description: string;
    raidTime: number;
    players: string;
    enemies: string[];

    constructor(mapId: string, language: LanguageCode) {
        this.language = language;
        const localeData = this.localService.getLocationLocale(mapId, language);

        this.name = localeData.name;
        this.description =
            localeData.description.length <= 200
                ? `*${localeData.description}*`
                : `*${localeData.description.substring(0, 197)}...*`;

        const mapData = this.dataService.fetchData("maps").find((m) => m.id === mapId) as TarkovDevMap;

        this.nameId = mapData.nameId;
        this.normalizedName = mapData.normalizedName;
        this.raidTime = mapData.raidDuration;
        this.players = mapData.players;
        this.enemies = mapData.enemies;
        this.bosses = mapData.bosses;
    }

    get iconURL(): string {
        return `${config.env.imageURL}/maps/${this.normalizedName}.png`;
    }

    get bossData(): BossData[] {
        const bossData = new Set<BossData | string>();

        this.bosses.forEach((boss) => {
            if (boss.name === "Death Knight") {
                bossData.add({ name: "Goons & Rogues", chance: boss.spawnChance * 100 });
                return;
            }

            const bossName = this.localService.getBotName(boss.name, this.language);

            if (boss.name === "Raider" || boss.name === "Rogue") {
                bossData.add(bossName);
                return;
            }

            bossData.add({
                name: bossName,
                chance: boss.spawnChance * 100
            });
        });

        return [...bossData].map((b) => {
            if (typeof b === "string") {
                return {
                    name: b
                };
            }
            return b;
        });
    }

    get maps(): MapImageData[] {
        const mapImages = this.dataService.fetchData("mapImages");

        return mapImages[this.normalizedName] ?? [];
    }

    get mapButtons(): ButtonBuilder[] {
        const t = translation(this.language);

        const formattedName = this.normalizedName.includes("-")
            ? this.normalizedName.split("-")[1]
            : this.normalizedName;

        return [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Map Genie")
                .setURL(`https://mapgenie.io/tarkov/maps/${formattedName}`),

            ...this.maps.map((image) =>
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(t(image.name))
                    .setCustomId(`map__${this.language}__${this.normalizedName}__${image.name}`)
            )
        ];
    }

    get currentTimes(): [string, string] | [string] {
        // adapted from https://github.com/adamburgess/tarkov-time

        if (this.nameId === "factory4_day") {
            return ["15:28:00"];
        } else if (this.nameId === "factory4_night") {
            return ["03:28:00"];
        }

        const hrs = (num: number) => 1000 * 60 * 60 * num;

        const tarkovRatio = 7;
        const date = new Date();
        const oneDay = hrs(24);
        const russia = hrs(3);
        const timeZoneOffset = hrs(date.getTimezoneOffset() / 60 + 1);

        const tarkovTime = (offset: number) =>
            new Date((timeZoneOffset + offset + date.getTime() * tarkovRatio) % oneDay);

        const leftOffset = russia;
        const rightOffset = russia + hrs(12);

        return [dayjs(tarkovTime(leftOffset)).format("HH:mm:ss"), dayjs(tarkovTime(rightOffset)).format("HH:mm:ss")];
    }
}
