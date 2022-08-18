import { ButtonComponent, Discord, Slash, SlashChoice, SlashOption } from "discordx";
import "reflect-metadata";
import { BaseCommand } from "../../lib/BaseCommand";
import { LanguageCode } from "../../../types/common";
import {
    InteractionReplyOptions,
    CommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction
} from "discord.js";
import { MAP_METADATA, MapID, Location } from "../../lib/models/Location";
import { translation } from "../../lib/util/translation";
import { TarkovDataService } from "../../services/TarkovDataService";
import { MapImageData } from "../../../types/services/TarkovDataService";
import { injectable } from "tsyringe";
import { round } from "../../lib/util/math";

const COMMAND_NAME = "map";

@Discord()
@injectable()
export class MapCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    map(
        @SlashChoice(...MAP_METADATA.map((m) => ({ name: `${m.name} ${m.variant ? m.variant : ""}`, value: m.id })))
        @SlashOption("map", BaseCommand.resolveOptions(COMMAND_NAME, "map"))
        map: MapID,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((respond) => {
                respond(this.command(map, this.getLanguage(interaction)));
            })
        );
    }

    @ButtonComponent(/^map__/)
    mapButton(interaction: ButtonInteraction) {
        const [, l, m, type] = interaction.customId.split("__");
        const map = m as MapID;
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

    command(mapId: MapID, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);
        const map = new Location(mapId, language);

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(`${map.displayName} - ${map.currentTimes.join(" | ")}`)
                    .setThumbnail(map.iconURL)
                    .setDescription(map.description)
                    .setImage(map.maps.length > 0 ? map.maps[0].link : null)
                    .setFooter({ text: t("Click the buttons below to view maps") })
                    .setFields(
                        {
                            name: t("Bosses"),
                            value: map.bossData
                                .map(
                                    (boss) =>
                                        `**${boss.name}** ${boss.chance ? `*(${boss.chance}%)*` : ""} ${
                                            boss.averageAmount ? `*(x${round(boss.averageAmount, "")})*` : ""
                                        }`
                                )
                                .join("\n"),
                            inline: true
                        },
                        {
                            name: t("Raid Time"),
                            value: t("{0} minutes", map.raidTime),
                            inline: true
                        },
                        {
                            name: t("Max Players"),
                            value: map.maxPlayers.toString(),
                            inline: true
                        }
                    )
            ],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(map.mapButtons)]
        };
    }
}
