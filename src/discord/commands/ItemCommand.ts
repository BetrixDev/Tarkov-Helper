import { Discord, Slash, SlashOption } from "discordx";
import "reflect-metadata";
import { injectable, container } from "tsyringe";
import { BaseCommand } from "../../lib/BaseCommand";
import { CommandInteraction, AutocompleteInteraction, InteractionReplyOptions } from "discord.js";
import { ItemSearchEngine } from "../../lib/search_engines/ItemSearchEngine";
import { LanguageCode } from "../../../types/common";
import { Item } from "../../lib/models/Item";
import { Barter } from "../../lib/models/Barter";
import { formatPrice } from "../../lib/util/string";
import { translation } from "../../lib/util/translation";
import { Craft } from "../../lib/models/Craft";
import { Quest } from "../../lib/models/Quest";
import { TaskObjective } from "../../../types/tarkov.dev/TarkovDevTask";

const COMMAND_NAME = "item";

@Discord()
@injectable()
export class ItemCommand extends BaseCommand {
    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    item(
        @SlashOption(
            "item",
            BaseCommand.resolveOptions(COMMAND_NAME, "item", {
                type: "STRING",
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
            new Promise((resolve, reject) => {
                resolve(this.command(id, interaction.locale.split("-")[0] as LanguageCode));
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

        const bartersUsingItem = Barter.fromRequiredItem(item, language);
        const bartersGivingItem = Barter.fromRewardItem(item, language);
        const craftsUsingItem = Craft.fromRequiredItem(item, language);
        const craftsGivingItem = Craft.fromRewardItem(item, language);
        const questsUsingItem = Quest.fromRequiredItem(item, language);
        const questsGivingItem = Quest.fromRewardItem(item, language);

        const title = item.props.CanSellOnRagfair
            ? t("{0} Information - {1}", item.shortName, formatPrice(item.data.avg24hPrice))
            : t("{0} Information - {1}", item.shortName, t("[BANNED ON FLEA]"));

        let description = item.description;

        if (questsUsingItem.length > 0) {
            // abstracted this function away to make the code below a little cleaner
            // all this does is return the amount of times the item is needed for the quest
            const resolveQuestObjectives = (objective: TaskObjective[]): number => {
                return objective.reduce((prevCount, obj) => {
                    if (obj.item && obj.item.id === item.id && obj.count && !obj.optional && obj.type !== "findItem") {
                        return prevCount + obj.count;
                    }

                    return prevCount;
                }, 0);
            };

            description = `
                ${description}
                \n
                ${item.shortName} is needed for the following quests:
                ${questsUsingItem.map((q) => `**${q.name}** - **x${resolveQuestObjectives(q.objectives)}**`).join("\n")}
            `;
        }

        // slightly safer to call this method here and check if it's defined instead of the other method I was using
        const itemBuyingPrice = item.buyingPrice();

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(title)
                    .setDescription(description)
                    .setThumbnail(item.iconURL)
                    .setFields(
                        {
                            name: t("Best Place to Sell"),
                            value: `${item.bestPlaceToSell.vendor.name} *(${formatPrice(
                                item.bestPlaceToSell.priceRUB
                            )})*`,
                            inline: true
                        },
                        {
                            name: t("Best Place to Buy"),
                            value:
                                itemBuyingPrice !== undefined
                                    ? `${itemBuyingPrice.vendor.name} *(${formatPrice(itemBuyingPrice.priceRUB)})*`
                                    : t("Can't be bought"),
                            inline: true
                        },
                        {
                            name: t("Barters Using {0}", item.shortName),
                            value:
                                bartersUsingItem.length > 0
                                    ? bartersUsingItem
                                          .map(
                                              (barter) =>
                                                  `• ${barter.reward.shortName} *(${formatPrice(barter.barterCost)})*`
                                          )
                                          .join("\n")
                                    : t("None"),
                            inline: true
                        },
                        {
                            name: t("Barters Giving {0}", item.shortName),
                            value:
                                bartersGivingItem.length > 0
                                    ? bartersGivingItem
                                          .map(
                                              (barter) =>
                                                  `• ${barter.traderData.name} LL${
                                                      barter.traderData.level
                                                  } *(${formatPrice(barter.barterCost)})*`
                                          )
                                          .join("\n")
                                    : t("None"),
                            inline: true
                        },
                        {
                            name: t("Crafts Using {0}", item.shortName),
                            value:
                                craftsUsingItem.length > 0
                                    ? craftsUsingItem
                                          .map(
                                              (craft) =>
                                                  `• ${craft.reward.shortName} *(${formatPrice(craft.craftCost)})*`
                                          )
                                          .join("\n")
                                    : t("None"),
                            inline: true
                        },
                        {
                            name: t("Crafts Giving {0}", item.shortName),
                            value:
                                craftsGivingItem.length > 0
                                    ? craftsGivingItem
                                          .map(
                                              (craft) =>
                                                  `• ${craft.station.name} *(${formatPrice(
                                                      craft.craftCost
                                                  )})* *(${formatPrice(craft.craftValue)})*`
                                          )
                                          .join("\n")
                                    : t("None"),
                            inline: true
                        },
                        {
                            name: t("Given from quests"),
                            value:
                                questsGivingItem.length > 0 ? questsGivingItem.map((q) => q.name).join("\n") : t("None")
                        }
                    )
            ]
        };
    }
}
