import "reflect-metadata";
import { LanguageCode } from "../../../types/common";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { ItemProps } from "../../../types/game/ItemProps";
import { calculateFleaFee } from "../util/math";
import { ItemPrice, TarkovDevItem, TarkovDevTypes } from "../../../types/tarkov.dev/TarkovDevItem";
import { TarkovLocaleService } from "../../services/TarkovLocaleService";

interface FleaMarketPrice extends ItemPrice {
    fee: number;
}

export class Item {
    id: string;
    name: string;
    wikiLink: string;
    shortName: string;
    props: ItemProps;
    data: TarkovDevItem;
    types: TarkovDevTypes[];

    private _description: string;
    private _dataService: TarkovDataService;

    constructor(id: string, language: LanguageCode = "en") {
        if (id === "customdogtags12345678910") {
            // when a barter can use either faction's dog tags for a barter, tarkov.dev's api returns the string above as the id, so we filter that to just use one of the dog tags
            id = "59f32bb586f774757e1e8442";
        }

        const dataService = container.resolve(TarkovDataService);
        this._dataService = dataService;

        const localeService = container.resolve(TarkovLocaleService);

        const itemProps = dataService.fetchData("items-tarkov-changes")[id];
        const locales = localeService.getItemLocale(id, language);
        const itemData = dataService.fetchData("items-tarkov-dev")[id];

        this.id = id;
        // fallback to default english names if there isn't an entry in the locales data
        this.name = locales.name ?? itemData.name;
        this.shortName = locales.shortName ?? itemData.shortName;
        this._description = locales.description ?? "";
        this.wikiLink = itemData.wikiLink;
        this.data = itemData;
        this.props = itemProps;
        this.types = itemData.types;
    }

    get description(): string {
        // Makes the description a quote and shrinks the text if its too long
        return this._description.length > 150
            ? `*${this._description.substring(0, 150)}*...`
            : `*${this._description}*`;
    }

    get keyData(): string[] | undefined {
        if (this.data.types.includes("keys")) {
            return this._dataService.fetchData("keys")[this.id];
        }
    }

    get iconURL(): string {
        // Thanks tarkov.dev :)
        return `https://assets.tarkov.dev/${this.id}-base-image.png`;
    }

    /**Sorted least to greatest */
    buyingPrice(index = 0): ItemPrice | undefined {
        if (
            this.id === "5449016a4bdc2d6f028b456f" || //  Roubles
            this.id === "59f32bb586f774757e1e8442" || //  Bear Dog tag
            this.id === "59f32c3b86f77472a31742f0" //     Usc Dog tag
        ) {
            // give certain items a value of 1 so we don't break things
            return {
                priceRUB: 1,
                vendor: {
                    name: "Flea Market"
                }
            };
        }

        return this.data.buyFor.sort((a, b) => a.priceRUB - b.priceRUB)[index];
    }

    /**Sorted greatest to least */
    sellingPrice(index = 0): ItemPrice {
        return this.data.sellFor.sort((a, b) => b.priceRUB - a.priceRUB)[index];
    }

    get bestPlaceToSell(): ItemPrice | FleaMarketPrice | undefined {
        // This function will take the flea market fee off the final price so that it better reflects the actual profit
        const resolvePrice = (i: ItemPrice): number => {
            let price = i.priceRUB;

            if (i.vendor.name === "Flea Market") {
                const fee = calculateFleaFee(this.data.basePrice, price);

                price = price - fee;
            }

            return price;
        };

        if (this.data.sellFor.length === 0) {
            return;
        }

        const bestSell = this.data.sellFor.sort((a, b) => {
            const rA = resolvePrice(a);
            const rB = resolvePrice(b);

            return rB - rA;
        })[0];

        if (bestSell.vendor.name === "Flea Market") {
            // Include the fee for the flea listing
            return {
                ...bestSell,
                fee: calculateFleaFee(this.data.basePrice, bestSell.priceRUB)
            };
        }

        return bestSell;
    }
}
