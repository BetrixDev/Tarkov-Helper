import { HexColorString } from "discord.js";
import { env } from "./env";

const imageURL = `https://${env.S3_NAME}.${env.S3_ENDPOINT}/images`;

export const config = {
    env: {
        botToken: env.BOT_TOKEN,
        imageURL: imageURL,
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
            search: `${imageURL}/assets/SearchLogo.png`,
            error: `${imageURL}/assets/ErrorLogo.png`,
            map: `${imageURL}/assets/MapLogo.png`,
            bitcoinFarm: `${imageURL}/assets/BitcoinFarmLogo.png`,
            settings: `${imageURL}/assets/SettingsLogo.png`,
            experience: `${imageURL}/assets/ExperienceLogo.png`,
            pricePerSlot: `${imageURL}/assets/PricePerSlotLogo.png`,
            question: `${imageURL}/assets/QuestionLogo.png`,
            exchangeRate: `${imageURL}/assets/ExchangeLogo.png`,
            roulette: `${imageURL}/assets/RouletteLogo.png`,
            status: `${imageURL}/assets/StatusLogo.png`,
            trader: `${imageURL}/assets/TraderLogo.png`,
            logo250: `${imageURL}/assets/Logo250x250.png`,
            secondBanner: `${imageURL}/assets/SecondBanner3000x1000.png`,
            slashBanner: `${imageURL}/assets/Media/SlashCommand.png`,
            author: `${imageURL}/assets/Logo50x50SmallText.png`
        }
    }
};
