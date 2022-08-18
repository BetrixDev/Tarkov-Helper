import "reflect-metadata";
import { Discord, Slash } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import { autoInjectable, inject, injectable } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import { LanguageCode } from "../../../types/common";
import { translation } from "../../lib/util/translation";
import { config } from "../../config";
import { Trader } from "../../lib/models/Trader";
import dayjs from "dayjs";
import { capitalizeWords } from "../../lib/util/string";

const COMMAND_NAME = "restocks";

@Discord()
@injectable()
export class RestocksCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    restocks(interaction: CommandInteraction) {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve) => {
                resolve(this.command(this.getLanguage(interaction)));
            })
        );
    }

    command(language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);
        const traderData = this.dataService.fetchData("traders");

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(t("Trader Restock Times"))
                    .setThumbnail(config.bot.images.trader)
                    .setFields(
                        ...traderData.map((trader) => {
                            return {
                                name: new Trader(capitalizeWords(trader.name), language).name,
                                value: `<t:${dayjs(trader.resetTime).unix()}:R>`,
                                inline: true
                            };
                        }),
                        {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        }
                    )
                    .setFooter({ text: t("Data from tarkov.dev") })
            ]
        };
    }
}
