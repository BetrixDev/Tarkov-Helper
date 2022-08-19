import "reflect-metadata";
import { Discord, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { BaseCommand } from "../../lib/BaseCommand";
import { translation } from "../../lib/util/translation";
import { LanguageCode } from "../../../types/common";
import { TarkovDataService } from "../../services/TarkovDataService";
import { Item } from "../../lib/models/Item";
import { formatPrice } from "../../lib/util/string";

const COMMAND_NAME = "dogtag";
// dot tag prices scale linearly with the level
const DOGTAG_PRICE_PER_LEVEL = 378;

@Discord()
export class DogtagCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    async dogtag(
        @SlashOption(
            "level",
            BaseCommand.resolveOptions(COMMAND_NAME, "level", {
                type: ApplicationCommandOptionType.Integer
            })
        )
        level: number,
        interaction: CommandInteraction
    ): Promise<void> {
        await this.handleCommandInteraction(
            interaction,
            new Promise((respond) => {
                respond(this.command(level, this.getLanguage(interaction)));
            })
        );
    }

    command(level: number, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);

        const levelData = this.dataService.fetchData("globals").config.exp.level.exp_table;

        // validate dogtag level
        const maxLevel = levelData.length;

        if (level > maxLevel || level < 1) {
            throw new Error(t("Please enter a valid level between 1 and {0}", maxLevel));
        }

        const dogTagData = new Item("59f32c3b86f77472a31742f0", language);

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(t("Dogtag Price"))
                    .setThumbnail(dogTagData.iconURL)
                    .setFields(
                        {
                            name: t("Level of Dogtag"),
                            value: level.toString()
                        },
                        {
                            name: t("Price of Dogtag"),
                            value: formatPrice(level * DOGTAG_PRICE_PER_LEVEL)
                        }
                    )
            ]
        };
    }
}
