import "reflect-metadata";
import { LanguageCode } from "../../typings/common";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { Item } from "./Item";
import { TarkovDevBarter } from "../../typings/tarkov.dev/TarkovDevBarter";
import { EmbedField } from "discord.js";
import { translation } from "../language";
import { formatPrice } from "../string";

interface TraderData {
    name: string;
    level: number;
}

interface RequiredItem {
    count: number;
    item: Item;
}

export class Barter {
    private dataService = container.resolve(TarkovDataService);
    private language: LanguageCode;

    barterCost: number;
    requiredItems: RequiredItem[];
    reward: Item;
    traderData: TraderData;

    private constructor(id: string, language: LanguageCode) {
        this.language = language;

        const barters = this.dataService.fetchData("barters");
        const barterData = barters.find((b) => b.id === id) as TarkovDevBarter;

        this.barterCost = barterData.requiredItems.reduce((prevCost, barterItem) => {
            const itemData = new Item(barterItem.item.id, language);

            let itemPrice = itemData.buyingPrice()?.priceRUB ?? 0;

            if (itemData.id === "59f32bb586f774757e1e8442" || itemData.id === "59f32c3b86f77472a31742f0") {
                if (barterItem.attributes && barterItem.attributes[0]) {
                    // Dog tags will get a price equal to the selling price of the lowest possible level tag for the barter
                    // We can directly index the array since there is only 1 possible attribute currently
                    itemPrice = Number(barterItem.attributes[0].value) * 378;
                }
            }

            return itemPrice * barterItem.count + prevCost;
        }, 0);

        this.traderData = {
            name: barterData.trader.name,
            level: barterData.level
        };

        this.requiredItems = barterData.requiredItems.map((i) => ({
            count: i.count,
            item: new Item(i.item.id, language)
        }));

        // Until bsg adds a barter that gives more than 1 item as a reward, this will do just fine and removes an un-needed array
        this.reward = new Item(barterData.rewardItems[0].item.id, language);
    }

    getSpecificItem(item: Item): RequiredItem {
        return this.requiredItems.find((i) => i.item.id === item.id) as RequiredItem;
    }

    generateEmbedFields(): EmbedField[] {
        const t = translation(this.language);

        const barterItems = this.requiredItems.map(
            ({ count, item }) =>
                `x**${count}** - [${item.shortName}](${item.wikiLink} "${item.name}") - ${formatPrice(
                    (item.buyingPrice()?.priceRUB ?? 0) * count
                )}`
        );

        const barterReward = this.reward;
        const itemBuyingPrice = barterReward.buyingPrice();

        return [
            {
                name: t("{0} LL{1} Barter", this.traderData.name, this.traderData.level),
                value: "\u200b",
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: t("Items"),
                value: barterItems.join("\n"),
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: t("Flea Market Price"),
                value: barterReward.canSellOnFlea ? formatPrice(barterReward.data.avg24hPrice) : t("Can't be bought"),
                inline: true
            },
            {
                name: t("Barter Total"),
                value: formatPrice(this.barterCost),
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: t("Barter Profit"),
                value:
                    itemBuyingPrice !== undefined
                        ? formatPrice(itemBuyingPrice.priceRUB - this.barterCost)
                        : t("Can't Calculate"),
                inline: true
            }
        ];
    }

    /** Returns an array of barters that give the specified item as a reward */
    static fromRewardItem(item: Item, language: LanguageCode): Barter[] {
        const barters = container.resolve(TarkovDataService).fetchData("barters");

        return barters
            .filter((barter) => barter.rewardItems[0].item.id === item.id)
            .map((barter) => new Barter(barter.id, language));
    }

    /** Returns an array of barters that require the specified item for the barter */
    static fromRequiredItem(item: Item, language: LanguageCode): Barter[] {
        const barters = container.resolve(TarkovDataService).fetchData("barters");

        return barters
            .filter((barter) => {
                const success = barter.requiredItems.find((i) => i.item.id === item.id);

                return success !== undefined ? true : false;
            })
            .map((barter) => new Barter(barter.id, language));
    }
}
