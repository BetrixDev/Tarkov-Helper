import "reflect-metadata";
import { ApplicationCommandOptionType, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { injectable } from "tsyringe";
import { LanguageCode } from "../../typings/common";
import { config } from "../../config";
import { BaseCommand } from "../../lib/BaseCommand";
import { formatNumber } from "../../lib/string";
import { translation, getLanguage } from "../../lib/language";
import { TarkovDataService } from "../../services/TarkovDataService";

interface ExperiencePoint {
    fromPrevious: number;
    total: number;
}

interface ExperienceData {
    maxLevel: number;
    experience: ExperiencePoint[];
}

const COMMAND_NAME = "experience";

@Discord()
@injectable()
export class ExperienceCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    experience(
        @SlashOption(
            "current",
            BaseCommand.resolveOptions(COMMAND_NAME, "current", { type: ApplicationCommandOptionType.Integer })
        )
        current: number,
        @SlashOption(
            "end",
            BaseCommand.resolveOptions(COMMAND_NAME, "end", { type: ApplicationCommandOptionType.Integer })
        )
        end: number,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((respond) => {
                respond(this.command(current, end, getLanguage(interaction)));
            })
        );
    }

    command(current: number, end: number, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);

        const { maxLevel, experience: experienceData } = this.fetchExperienceData();

        if (current <= maxLevel && end <= maxLevel && current !== end) {
            return {
                embeds: [
                    this.createEmbed()
                        .setTitle(t("Experience Calculator"))
                        .setThumbnail(config.bot.images.experience)
                        .setFields({
                            name: t(`Experience Gap from {0} to {1}`, current, end),
                            value:
                                formatNumber(
                                    Math.abs(experienceData[current - 1].total - experienceData[end - 1].total)
                                ) + "xp"
                        })
                ]
            };
        } else if (current > maxLevel && end <= maxLevel) {
            return {
                embeds: [
                    this.createEmbed()
                        .setTitle(t("Experience Calculator"))
                        .setThumbnail(config.bot.images.experience)
                        .setFields({
                            name: t(`Experience Gap from {0}xp to {1}`, current, end),
                            value: formatNumber(Math.abs(current - experienceData[end - 1].total)) + t("xp")
                        })
                ]
            };
        } else if (current === end) {
            throw new Error("Both level values are the same");
        } else {
            throw new Error("There was an error with the level values inputted");
        }
    }

    fetchExperienceData(): ExperienceData {
        const levelData = this.dataService.fetchData("globals").config.exp.level.exp_table;

        const maxLevel = levelData.length;

        let total = 0;
        const table: ExperiencePoint[] = [];

        levelData.forEach(({ exp }) => {
            total += exp;
            table.push({ fromPrevious: exp, total });
        });

        return { maxLevel, experience: table };
    }
}
