import "reflect-metadata";
import { ButtonComponent, Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import { LanguageCode } from "../../typings/common";
import {
    InteractionReplyOptions,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction
} from "discord.js";
import { Location } from "../../lib/models/Location";
import { translation, getLanguage } from "../../lib/language";
import { TarkovDataService } from "../../services/TarkovDataService";
import { MapImageData } from "../../typings/services/TarkovDataService";
import { injectable, container } from "tsyringe";

const COMMAND_NAME = "map";

@Discord()
@injectable()
export class MapCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    map(
        @SlashChoice(
            ...container
                .resolve(TarkovDataService)
                .fetchData("maps")
                .map((map) => ({ name: map.name as string, value: map.id as string }))
        )
        @SlashOption("map", BaseCommand.resolveOptions(COMMAND_NAME, "map"))
        map: string,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((respond) => {
                respond(this.command(map, getLanguage(interaction)));
            })
        );
    }

    @ButtonComponent(/^map__/)
    mapButton(interaction: ButtonInteraction) {
        const [, l, m, type] = interaction.customId.split("__");
        const map = m;
        const language = l as LanguageCode;

        const t = translation(language);

        const imageData = this.dataService
            .fetchData("mapImages")
            [map.toLowerCase().replaceAll(/(day|night| )/g, "")].find((t) => t.name == type) as MapImageData;

        interaction.reply({
            embeds: [
                this.createEmbed()
                    .setImage(imageData.link)
                    .setTitle(t("{0} {1} Map", map, type))
                    .setFooter({ text: t("Map created by: {0}", imageData.author) })
            ],
            ephemeral: true
        });
    }

    command(mapId: string, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);
        const map = new Location(mapId, language);

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(`${map.name} - ${map.currentTimes.join(" | ")}`)
                    .setThumbnail(map.iconURL)
                    .setImage(map.maps.length > 0 ? map.maps[0].link : null)
                    .setFooter({ text: t("Click the buttons below to view maps") })
                    .setFields(
                        {
                            name: t("Bosses"),
                            value: map.bossData
                                .map((boss) => `**${boss.name}** ${boss.chance ? `*(${boss.chance}%)*` : ""} `)
                                .join("\n"),
                            inline: true
                        },
                        {
                            name: t("Raid Time"),
                            value: t("{0} minutes", map.raidTime),
                            inline: true
                        },
                        {
                            name: t("Players"),
                            value: map.players,
                            inline: true
                        },
                        {
                            name: t("Enemy Types"),
                            value: map.enemies.join("\n"),
                            inline: true
                        }
                    )
            ],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(map.mapButtons)]
        };
    }
}
