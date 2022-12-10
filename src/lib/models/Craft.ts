import "reflect-metadata";
import { container } from "tsyringe";
import { LanguageCode } from "../../typings/common";
import { TarkovDataService } from "../../services/TarkovDataService";
import { HideoutStations, TarkovDevCraft } from "../../typings/services/TarkovDataService";
import { Item } from "./Item";

// Similar setup to the Barter class

export class Craft {
    private dataService = container.resolve(TarkovDataService);

    craftCost: number;
    craftValue: number;
    requiredItems: Item[];
    duration: number; // seconds
    reward: Item;
    station: Omit<HideoutStations, "levels">;

    private constructor(id: string, language: LanguageCode) {
        const crafts = this.dataService.fetchData("crafts");

        const craftData = crafts.find((c) => c.id === id) as TarkovDevCraft;

        this.craftCost = craftData.requiredItems.reduce((prevCost, craftItem) => {
            const itemData = new Item(craftItem.item.id, language);

            const itemBuyingPrice = itemData.buyingPrice();
            let itemPrice = itemBuyingPrice ? itemBuyingPrice.priceRUB : itemData.data.avg24hPrice;

            if (itemData.id === "59f32bb586f774757e1e8442" || itemData.id === "59f32c3b86f77472a31742f0") {
                if (craftItem.attributes && craftItem.attributes[0]) {
                    // Dog tags will get a price equal to the selling price of the lowest possible level tag for the craft
                    // We can directly index the array since there is only 1 possible attribute currently
                    itemPrice = Number(craftItem.attributes[0].value) * 378;
                }
            }

            return itemPrice * craftItem.count + prevCost;
        }, 0);

        this.craftValue = craftData.rewardItems.reduce((prevValue, craftItem) => {
            const itemData = new Item(craftItem.item.id, language);

            const itemBuyingPrice = itemData.buyingPrice();
            let itemPrice = itemBuyingPrice ? itemBuyingPrice.priceRUB : itemData.data.avg24hPrice;

            if (itemData.id === "59f32bb586f774757e1e8442" || itemData.id === "59f32c3b86f77472a31742f0") {
                if (craftItem.attributes && craftItem.attributes[0]) {
                    // Dog tags will get a price equal to the selling price of the lowest possible level tag for the craft
                    // We can directly index the array since there is only 1 possible attribute currently
                    itemPrice = Number(craftItem.attributes[0].value) * 378;
                }
            }

            return itemPrice * craftItem.count + prevValue;
        }, 0);

        this.requiredItems = craftData.requiredItems.map((i) => new Item(i.item.id, language));

        this.reward = new Item(craftData.rewardItems[0].item.id, language);
        this.duration = craftData.duration;
        this.station = craftData.station;
    }

    /** Returns an array of crafts that give the specified item as a reward */
    static fromRewardItem(item: Item, language: LanguageCode): Craft[] {
        const crafts = container.resolve(TarkovDataService).fetchData("crafts");

        return crafts
            .filter((craft) => craft.rewardItems[0].item.id === item.id)
            .map((craft) => new Craft(craft.id, language));
    }

    /** Returns an array of crafts that require the specified item for the craft */
    static fromRequiredItem(item: Item, language: LanguageCode): Craft[] {
        const crafts = container.resolve(TarkovDataService).fetchData("crafts");

        return crafts
            .filter((craft) => {
                let success = craft.requiredItems.find((i) => i.item.id === item.id);

                if (success !== undefined) {
                    success.attributes?.forEach((a) => {
                        if (a.type === "tool") {
                            // don't count auxiliary tools
                            success = undefined;
                        }
                    });
                }
            })
            .map((craft) => new Craft(craft.id, language));
    }
}
