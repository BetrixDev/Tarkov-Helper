import { DATABASE_LOCATION } from '../Lib'

const color: [number, number, number] = [21, 36, 46]
const altColor: [number, number, number] = [221, 204, 76]
const errorColor: [number, number, number] = [255, 36, 36]

export default {
    botSettings: {
        color,
        altColor,
        errorColor
    },
    images: {
        logo250: `${DATABASE_LOCATION}/images/assets/Logo250x250.png`,
        secondBanner: ` ${DATABASE_LOCATION}/images/assets/SecondBanner3000x1000.png`,
        slashBanner: `${DATABASE_LOCATION}/images/assets/Media/SlashCommand.png`,
        author: `${DATABASE_LOCATION}/images/assets/Logo50x50SmallText.png`,
        thumbnails: {
            search: `${DATABASE_LOCATION}/images/assets/SearchLogo.png`,
            error: `${DATABASE_LOCATION}/images/assets/ErrorLogo.png`,
            map: `${DATABASE_LOCATION}/images/assets/MapLogo.png`,
            bitcoinfarm: `${DATABASE_LOCATION}/images/assets/BitcoinFarmLogo.png`,
            settings: `${DATABASE_LOCATION}/images/assets/SettingsLogo.png`,
            experience: `${DATABASE_LOCATION}/images/assets/ExperienceLogo.png`,
            priceperslot: `${DATABASE_LOCATION}/images/assets/PricePerSlotLogo.png`,
            question: `${DATABASE_LOCATION}/images/assets/QuestionLogo.png`,
            exchangerate: `${DATABASE_LOCATION}/images/assets/ExchangeLogo.png`,
            roulette: `${DATABASE_LOCATION}/images/assets/RouletteLogo.png`,
            status: `${DATABASE_LOCATION}/images/assets/StatusLogo.png`,
            trader: `${DATABASE_LOCATION}/images/assets/TraderLogo.png`
        }
    }
}
