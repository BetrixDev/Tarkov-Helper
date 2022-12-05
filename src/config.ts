import { HexColorString } from "discord.js";
import { env } from "./env";

const databaseURL = env.DATABASE_URL;

export const config = {
    env: {
        botToken: env.BOT_TOKEN,
        tarkovChangesToken: env.TARKOV_CHANGES_TOKEN,
        databaseURL,
        topGGToken: env.TOPGG_TOKEN
    },
    process: {
        isDev: env.NODE_ENV === "development",
        isTest: env.NODE_ENV === "testing"
    },
    bot: {
        name: "Tarkov Helper",
        // Type cast so discord.js realizes it's valid
        color: "#152424" as HexColorString,
        altColor: "#ddcc4c" as HexColorString,
        errorColor: "#ff2424" as HexColorString,
        images: {
            search: `${databaseURL}/images/assets/SearchLogo.png`,
            error: `${databaseURL}/images/assets/ErrorLogo.png`,
            map: `${databaseURL}/images/assets/MapLogo.png`,
            bitcoinFarm: `${databaseURL}/images/assets/BitcoinFarmLogo.png`,
            settings: `${databaseURL}/images/assets/SettingsLogo.png`,
            experience: `${databaseURL}/images/assets/ExperienceLogo.png`,
            pricePerSlot: `${databaseURL}/images/assets/PricePerSlotLogo.png`,
            question: `${databaseURL}/images/assets/QuestionLogo.png`,
            exchangeRate: `${databaseURL}/images/assets/ExchangeLogo.png`,
            roulette: `${databaseURL}/images/assets/RouletteLogo.png`,
            status: `${databaseURL}/images/assets/StatusLogo.png`,
            trader: `${databaseURL}/images/assets/TraderLogo.png`,
            logo250: `${databaseURL}/images/assets/Logo250x250.png`,
            secondBanner: `${databaseURL}/images/assets/SecondBanner3000x1000.png`,
            slashBanner: `${databaseURL}/images/assets/Media/SlashCommand.png`,
            author: `${databaseURL}/images/assets/Logo50x50SmallText.png`
        }
    }
};
