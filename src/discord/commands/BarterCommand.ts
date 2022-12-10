import "reflect-metadata";
import { Discord, Slash, SlashOption, ButtonComponent } from "discordx";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    EmbedField,
    InteractionReplyOptions,
    InteractionUpdateOptions,
    ButtonBuilder,
    ButtonStyle
} from "discord.js";
import { BaseCommand } from "../../lib/BaseCommand";
import { LanguageCode } from "../../typings/common";
import { container } from "tsyringe";
import { ItemSearchEngine } from "../../lib/search_engines/ItemSearchEngine";
import { Item } from "../../lib/models/Item";
import { Barter } from "../../lib/models/Barter";
import { translation } from "../../lib/util/translation";
import { formatPrice } from "../../lib/util/string";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COMMAND_NAME = "barter";

@Discord()
export class BarterCommand extends BaseCommand {
    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    barter(
        @SlashOption(
            "item",
            BaseCommand.resolveOptions(COMMAND_NAME, "item", {
                type: ApplicationCommandOptionType.String,
                autocomplete: (interaction: AutocompleteInteraction) => {
                    container.resolve(ItemSearchEngine).handleAutoComplete(interaction);
                }
            })
        )
        id: string,
        interaction: CommandInteraction
    ): void {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve) => {
                resolve(this.command(id, getLanguage(interaction)));
            })
        );
    }

    @ButtonComponent(/barter__(b|f)__(.*)__[0-9]+/)
    button(interaction: ButtonInteraction): void {
        const [, action, id, p] = interaction.customId.split("__");
        const page = Number(p);
        const language = getLanguage(interaction);

        if (action === "b") {
            interaction.update(this.command(id, language, page - 1) as InteractionUpdateOptions);
        } else {
            interaction.update(this.command(id, language, page + 1) as InteractionUpdateOptions);
        }
    }

    @ButtonComponent(/item-barter__(.*)/)
    button2(interaction: ButtonInteraction) {
        const [_, id] = interaction.customId.split("__");

        interaction.reply({ ...this.command(id, getLanguage(interaction)), ephemeral: true });
    }

    command(id: string, language: LanguageCode, page = 0): InteractionReplyOptions {
        const [success, itemId] = this.validateItemInput(id);

        // Second condition is for type guarding to make typescript happy
        if (!success || typeof itemId !== "string") {
            throw Error("Input not valid, please use the auto complete function to complete your search");
        }

        const t = translation(language);

        const item = new Item(itemId, language);
        const barters = Barter.fromRewardItem(item, language);
        const bartersUsingItem = Barter.fromRequiredItem(item, language);

        const pages = barters.length;
        const fields: EmbedField[] = [];

        fields.push(
            bartersUsingItem.length > 0
                ? {
                      name: t("Using in barters"),
                      value: bartersUsingItem
                          .map((b) =>
                              t(
                                  "**x{0}** in {1} *({2})*",
                                  b.getSpecificItem(item).count,
                                  b.reward.shortName,
                                  formatPrice(b.barterCost)
                              )
                          )
                          .join("\n"),
                      inline: true
                  }
                : {
                      name: t("Used in barters"),
                      value: t("None"),
                      inline: true
                  }
        );

        // fill up the first row of the embed fields to keep everything aligned
        fields.push({ name: "\u200b", value: "\u200b", inline: true });
        fields.push({ name: "\u200b", value: "\u200b", inline: true });

        if (pages === 0) {
            // item has no barters
            return {
                embeds: [
                    this.createEmbed()
                        .setThumbnail(item.iconURL)
                        .setTitle(t("{0} Barters", item.shortName))
                        .setDescription(`${t("[Wiki Link]({0})", item.wikiLink)}\n${t("No Barters")}`)
                        .setFields(fields)
                ]
            };
        }

        return {
            embeds: [
                this.createEmbed()
                    .setThumbnail(item.iconURL)
                    .setTitle(t("{0} Barters", item.shortName))
                    .setDescription(t("[Wiki Link]({0})", item.wikiLink))
                    .setFields(...barters[page].generateEmbedFields())
            ],
            components:
                // only display the buttons if there is more than 1 barter
                pages !== 1
                    ? [
                          new ActionRowBuilder<ButtonBuilder>().addComponents(
                              new ButtonBuilder()
                                  .setCustomId(`barter__b__${id}__${page}`)
                                  .setLabel(t("Last Barter"))
                                  .setDisabled(page === 0) // disable button if on the first page
                                  .setStyle(ButtonStyle.Primary),
                              new ButtonBuilder()
                                  .setCustomId("no_id")
                                  .setLabel(`${page + 1} / ${pages}`)
                                  .setDisabled(true)
                                  .setStyle(ButtonStyle.Secondary),
                              new ButtonBuilder()
                                  .setCustomId(`barter__f__${id}__${page}`)
                                  .setLabel(t("Next Barter"))
                                  .setDisabled(page === pages - 1) // disable button if on the last page
                                  .setStyle(ButtonStyle.Primary)
                          )
                      ]
                    : []
        };
    }
}
