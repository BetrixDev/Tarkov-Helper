import "reflect-metadata";
import { Discord, Slash, SlashOption } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import { ApplicationCommandOptionType, CommandInteraction, InteractionReplyOptions } from "discord.js";
import { LanguageCode } from "../../typings/common";
import { translation } from "../../lib/util/translation";
import { Item } from "../../lib/models/Item";
import { config } from "../../config";
import { round } from "../../lib/util/math";
import { formatPrice } from "../../lib/util/string";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COMMAND_NAME = "bitcoinfarm";

@Discord()
export class BitcoinFarmCommand extends BaseCommand {
    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    bitcoinFarm(
        @SlashOption(
            "gpus",
            BaseCommand.resolveOptions(COMMAND_NAME, "gpus", { type: ApplicationCommandOptionType.Integer })
        )
        gpus: number,
        @SlashOption(
            "compare",
            BaseCommand.resolveOptions(COMMAND_NAME, "compare", {
                type: ApplicationCommandOptionType.Integer,
                required: false
            })
        )
        compare: number,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve, reject) => {
                resolve(this.command(getLanguage(interaction), gpus, compare));
            })
        );
    }

    command(language: LanguageCode, gpus: number, compare?: number): InteractionReplyOptions {
        const t = translation(language);

        if (!compare) {
            const farm = new BitcoinFarm(gpus);

            return {
                embeds: [
                    this.createEmbed()
                        .setTitle(t("Bitcoin Farm Calculator"))
                        .setThumbnail(config.bot.images.bitcoinFarm)
                        .setDescription(`*${t("This calculator does not account for any special bonuses")}*`)
                        .setFields(
                            { name: t("Bitcoin Price"), value: formatPrice(farm.btcPrice) },
                            {
                                name: t("Amount of GPUS"),
                                value: farm.gpus.toString()
                            },
                            {
                                name: t("Bitcoins Per Day"),
                                value: `₿ ${round(farm.bitcoinsPerDay, "000")}`
                            },
                            {
                                name: t("Roubles Per Day"),
                                value: formatPrice(farm.rubPerDay)
                            }
                        )
                ]
            };
        } else {
            const farm = new BitcoinFarm(gpus);
            const farm2 = new BitcoinFarm(compare);

            return {
                embeds: [
                    this.createEmbed()
                        .setTitle(t("Bitcoin Farm Calculator"))
                        .setThumbnail(config.bot.images.bitcoinFarm)
                        .setDescription(`*${t("This calculator does not account for any special bonuses")}*`)
                        .addFields(
                            {
                                name: t("Bitcoin Price"),
                                value: formatPrice(farm.btcPrice)
                            },
                            {
                                name: t("Difference in GPUs"),
                                value: `${Math.abs(farm.gpus - farm2.gpus)} *(${farm.gpus} - ${farm2.gpus})*`
                            },
                            {
                                name: t("Difference in Bitcoins Per Day"),
                                value: "₿ " + round(Math.abs(farm.bitcoinsPerDay - farm2.bitcoinsPerDay), "000")
                            },
                            {
                                name: t("Difference in RUB Per Day"),
                                value: formatPrice(Math.abs(farm.rubPerDay - farm2.rubPerDay))
                            }
                        )
                ]
            };
        }
    }
}

export class BitcoinFarm {
    gpus: number;
    btcPrice: number;

    constructor(gpus: number) {
        this.gpus = gpus;

        // Get the highest selling price
        this.btcPrice = new Item("59faff1d86f7746c51718c9c", "en").sellingPrice()?.priceRUB as number;
    }

    get bitcoinsPerDay() {
        // https://escapefromtarkov.fandom.com/wiki/Hideout#Additional_Information
        return (1 / (145000 / (1 + (this.gpus - 1) * 0.041225) / 3600)) * 24;
    }

    get rubPerDay() {
        return Math.round(this.bitcoinsPerDay * this.btcPrice);
    }
}
