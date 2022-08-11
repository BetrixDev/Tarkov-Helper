import "reflect-metadata";
import { Discord, Slash, SlashOption } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
    InteractionReplyOptions
} from "discord.js";
import { container } from "tsyringe";
import { ItemSearchEngine } from "../../lib/search_engines/ItemSearchEngine";
import { LanguageCode } from "../../../types/common";
import { translation } from "../../lib/util/translation";
import { Item } from "../../lib/models/Item";
import { getItemFields, getStatImage } from "../../lib/helpers/gameStats";
import { EmbedField } from "discord.js";

const COMMAND_NAME = "stat";

@Discord()
export class StatCommand extends BaseCommand {
    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    stat(
        @SlashOption(
            "item",
            BaseCommand.resolveOptions(COMMAND_NAME, "item", {
                type: ApplicationCommandOptionType.String,
                autocomplete: (interaction: AutocompleteInteraction) => {
                    container
                        .resolve(ItemSearchEngine)
                        .handleAutoComplete(interaction, (item) => !item.types.includes("preset"));
                }
            })
        )
        id: string,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve, reject) => {
                resolve(this.command(id, this.getLanguage(interaction)));
            })
        );
    }

    command(id: string, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);
        const [success, itemId] = this.validateItemInput(id);

        // Second condition is for type guarding and to make typescript happy
        if (!success || typeof itemId !== "string") {
            throw Error(t("Input not valid, please use the auto complete function to complete your search"));
        }

        const item = new Item(itemId, language);
        const itemFields = getItemFields(item, t);

        const fields: EmbedField[] =
            itemFields.length > 0 ? itemFields : [{ name: "\u200b", value: "No special stats", inline: true }];

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(t("{0} Stats", item.shortName))
                    .setDescription(
                        `
                            ${t("[Wiki Link]({0})", item.wikiLink)}
                            ${item.description}
                        `
                    )
                    .setThumbnail(item.iconURL)
                    .addFields(fields)
                    .setImage(getStatImage(item).url)
            ]
        };
    }
}
