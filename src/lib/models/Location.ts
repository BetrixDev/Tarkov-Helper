import "reflect-metadata";
import { LanguageCode } from "../../../types/common";
import { container } from "tsyringe";
import { Endpoint, TarkovDataService } from "../../services/TarkovDataService";
import { LocationLocale, GameLocales } from "../../../types/game/GameLocales";
import { translation } from "../util/translation";
import { GameMap } from "../../../types/game/GameMap";
import { capitalizeWords, formatNumber } from "../util/string";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import dayjs from "dayjs";
import { MapImageData } from "../../../types/services/TarkovDataService";

interface MapMetaData {
    id: string;
    name: string;
    variant?: string;
    time: string;
}

interface BossData {
    name: string;
    chance?: number;
    averageAmount?: number;
}

export const MAP_METADATA = [
    { id: "lighthouse", name: "Lighthouse" },
    { id: "laboratory", name: "The Lab" },
    { id: "woods", name: "Woods" },
    { id: "bigmap", name: "Customs" },
    { id: "factory4_day", name: "Factory", variant: "Day" },
    { id: "factory4_night", name: "Factory", variant: "Night" },
    { id: "rezervbase", name: "Reserve" },
    { id: "shoreline", name: "Shoreline" },
    { id: "interchange", name: "Interchange" }
];

export type MapID = typeof MAP_METADATA[number]["id"];

export class Location {
    private localeData: LocationLocale;
    private mapId: string;
    private dataService: TarkovDataService;
    private locales: GameLocales;
    private language: LanguageCode;
    private mapData: GameMap;

    displayName: string;
    description: string;
    raidTime: number;
    maxPlayers: number;

    constructor(map: MapID, language: LanguageCode) {
        this.mapId = map;
        this.language = language;
        const t = translation(language);

        const dataService = container.resolve(TarkovDataService);
        this.dataService = dataService;

        const metaData = MAP_METADATA.find(({ id }) => id === map) as MapMetaData;

        const enLocales = dataService.fetchData("locales/global/en");
        const locales = dataService.fetchData(`locales/global/${language}`);
        this.locales = locales;

        const localeData = Object.entries(enLocales.locations).find(([, data]) => data.Name === metaData.name) as [
            string,
            LocationLocale
        ];
        this.localeData = locales.locations[localeData[0]];

        this.description =
            this.localeData.Description.length > 200
                ? `"*${this.localeData.Description}*"`
                : `"*${this.localeData.Description.substring(0, 197)}...*"`;
        this.displayName = `${this.localeData.Name} ${metaData.variant ? t(metaData.variant) : ""}`;

        const mapData = this.dataService.fetchData<Endpoint, GameMap>(`locations/${this.mapId}/base` as Endpoint);
        this.mapData = mapData;

        this.raidTime = mapData.EscapeTimeLimit;
        this.maxPlayers = mapData.MaxPlayers;
    }

    get iconURL(): string {
        return `https://raw.githubusercontent.com/Tarkov-Helper/Database/main/images/map_icons/${this.displayName
            .replaceAll(/(day|night| )/g, "")
            .toLowerCase()}.png`;
    }

    get bossData(): BossData[] {
        const bosses: string[] = [];

        this.mapData.BossLocationSpawn.forEach((boss) => {
            if (!bosses.includes(boss.BossName)) {
                bosses.push(boss.BossName);
            }
        });

        const bossData: BossData[] = [];

        bosses.forEach((bossName) => {
            const spawns = this.mapData.BossLocationSpawn.filter((boss) => boss.BossName === bossName);

            if (spawns.length === 1) {
                if (bossName === "bossKnight") {
                    bossData.push({ name: "Rogue Bosses", chance: spawns[0].BossChance, averageAmount: 3 });
                } else if (bossName.includes("boss")) {
                    const name = this.locales.interface[`QuestCondition/Elimination/Kill/BotRole/${bossName}`];

                    if (name) {
                        bossData.push({ name, chance: spawns[0].BossChance });
                    }
                } else if (bossName === "sectantPriest") {
                    const name = this.locales.interface[`QuestCondition/Elimination/Kill/BotRole/${bossName}`];

                    if (name) {
                        bossData.push({
                            name,
                            chance: spawns[0].BossChance,
                            averageAmount: Number(spawns[0].BossEscortAmount) + 1
                        });
                    }
                }
            }

            const name = this.locales.interface[`ScavRole/${capitalizeWords(bossName)}`];

            if (!name) return;

            const averageAmount = spawns.reduce((prev, curr) => {
                const length = curr.BossEscortAmount.split(",").length;

                const sum = curr.BossEscortAmount.split(",")
                    .map((n) => Number(n))
                    .reduce((p, c) => p + c, 0);

                return prev + sum / length;
            }, 0);

            bossData.push({ name, averageAmount });
        });

        return bossData;
    }

    get maps(): MapImageData[] {
        const mapImages = this.dataService.fetchData("mapImages");
        const formattedName = this.displayName.toLowerCase().replaceAll(/(day|night| )/g, "");

        return mapImages[formattedName] ?? [];
    }

    get mapButtons(): ButtonBuilder[] {
        const t = translation(this.language);

        const formattedName = this.displayName.toLowerCase().replaceAll(/(the|day|night| )/g, "");

        return [
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel("Map Genie")
                .setURL(`https://mapgenie.io/tarkov/maps/${formattedName}`),

            ...this.maps.map((image) =>
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(t(image.name))
                    .setCustomId(`map__${this.language}__${this.displayName}__${image.name}`)
            )
        ];
    }

    get currentTimes(): [string, string] | [string] {
        // adapted from https://github.com/adamburgess/tarkov-time

        if (this.mapId === "factory4_day") {
            return ["15:28:00"];
        } else if (this.mapId === "factory4_night") {
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
