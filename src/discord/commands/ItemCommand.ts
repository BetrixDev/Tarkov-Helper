import "reflect-metadata";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import { injectable, container } from "tsyringe";
import { BaseCommand } from "../../lib/BaseCommand";
import {
    CommandInteraction,
    AutocompleteInteraction,
    InteractionReplyOptions,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";
import { ItemSearchEngine } from "../../lib/search_engines/ItemSearchEngine";
import { LanguageCode } from "../../typings/common";
import { Item } from "../../lib/models/Item";
import { Barter } from "../../lib/models/Barter";
import { formatPrice } from "../../lib/util/string";
import { translation, TranslationFunction } from "../../lib/util/translation";
import { Craft } from "../../lib/models/Craft";
import { Quest } from "../../lib/models/Quest";
import { TaskObjective } from "../../typings/tarkov.dev/TarkovDevTask";
import { ButtonBuilder } from "discord.js";
import { TarkovDataService } from "../../services/TarkovDataService";
import logger from "../../logger";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COMMAND_NAME = "item";
const NAMESPACE = "ItemCommand";

@Discord()
@injectable()
export class ItemCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    @Slash("price", BaseCommand.resolveCommandOptions("price"))
    item(
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
    ): void {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve, reject) => {
                resolve(this.command(id, getLanguage(interaction)));
            })
        );
    }

    @ButtonComponent(/locations__(.*)/)
    locations(interaction: ButtonInteraction) {
        const id = interaction.customId.split("__")[1];

        const t = translation(getLanguage(interaction));
        const item = new Item(id, getLanguage(interaction));
        const locations = this.dataService.fetchData("itemLocations");

        if (locations[id] === undefined) {
            logger.warn(NAMESPACE, `Unable to retrieve spawning data for ${item.id}`);
            interaction.reply({ ephemeral: true, content: `Unable to retrieve spawning data for ${item.shortName}` });
            return;
        }

        const data = locations[id];

        if (data.length === 1) {
            interaction.reply({
                ephemeral: true,
                content: `${item.shortName} has no specific spawning locations.\nThere may be more information on the wiki\n${item.wikiLink}`
            });
            return;
        }

        const formattedData = data.map((line) => {
            if (line.startsWith("-")) {
                return `**${line.replace("-", "•")}**`;
            } else if (line.startsWith("    -")) {
                return line.replace("    -", "> •");
            }
        });

        // very rare edge case
        if (formattedData.join("\n").length < 4096) {
            interaction.reply({
                ephemeral: true,
                embeds: [
                    this.createEmbed()
                        .setTitle(t("{0} Spawning Locations", item.shortName))
                        .setDescription(formattedData.join("\n"))
                        .setThumbnail(item.iconURL)
                        .setFooter({ text: t("Data from the wiki") })
                ]
            });
        } else {
            interaction.reply({
                ephemeral: true,
                content: `${item.shortName} spawning data is too long to display.\nCheck the wiki for more information\n${item.wikiLink}`
            });
        }
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

        const title = item.canSellOnFlea
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
                [Wiki Link](${item.wikiLink})
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
                            value:
                                item.bestPlaceToSell !== undefined
                                    ? `${item.bestPlaceToSell.vendor.name} *(${formatPrice(
                                          item.bestPlaceToSell.priceRUB
                                      )})*`
                                    : t("Can't be sold"),
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
                            value: this.generateQuestRewardInfo(questsGivingItem, t)
                        }
                    )
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`stat__${item.id}`)
                        .setLabel(t("View Stats")),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`item-barter__${item.id}`)
                        .setLabel(t("View Barters")),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`locations__${item.id}`)
                        .setLabel(t("Spawn Locations"))
                )
            ]
        };
    }

    generateQuestRewardInfo(quests: Quest[], t: TranslationFunction): string {
        if (quests.length === 0) {
            return t("None");
        }

        if (quests.length < 10) {
            return quests.map((q) => q.name).join("\n");
        }

        return t("{0} quests", quests.length);
    }
}
