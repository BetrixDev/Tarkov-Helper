import "reflect-metadata";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import { CommandInteraction, InteractionReplyOptions, Locale } from "discord.js";
import { LanguageCode } from "../../../types/common";
import { translation } from "../../lib/util/translation";
import { injectable } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COMMAND_NAME = "status";

@Discord()
@injectable()
export class StatusCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    status(interaction: CommandInteraction) {
        this.handleCommandInteraction(
            interaction,
            new Promise((respond) => {
                respond(this.command(getLanguage(interaction), interaction.locale));
            })
        );
    }

    command(language: LanguageCode, locale: Locale): InteractionReplyOptions {
        const t = translation(language);

        const status = this.dataService.fetchData("status");

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(`${status.generalStatus.name} Status: ${status.generalStatus.statusCode}`)
                    .addFields(
                        status.currentStatuses.map((s) => {
                            return {
                                name: s.name,
                                value: s.statusCode.replace("OK", "Stable"),
                                inline: true
                            };
                        })
                    )
            ]
        };
    }
}
