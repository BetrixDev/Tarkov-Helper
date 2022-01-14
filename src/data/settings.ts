const color: [number, number, number] = [21, 36, 46]
const altColor: [number, number, number] = [221, 204, 76]
const errorColor: [number, number, number] = [255, 36, 36]

const mediaPrefix = `https://raw.githubusercontent.com/Tarkov-Helper/Tarkov-Helper-Assets/main/Media/`
const gistPrefix = `https://gist.github.com/BetrixDev/`

export = {
    botSettings: {
        color: color,
        altColor: altColor,
        errorColor: errorColor
    },
    images: {
        logo250: `${mediaPrefix}Logo250x250.png`,
        secondBanner: `${mediaPrefix}SecondBanner3000x1000.png`,
        slashBanner: `${mediaPrefix}SlashCommand.png`,
        author: `${mediaPrefix}Logo50x50SmallText.png`,
        thumbnails: {
            search: `${mediaPrefix}SearchLogo.png`,
            error: `${mediaPrefix}ErrorLogo.png`,
            map: `${mediaPrefix}MapLogo.png`,
            bitcoinfarm: `${mediaPrefix}BitcoinFarmLogo.png`,
            settings: `${mediaPrefix}SettingsLogo.png`,
            experience: `${mediaPrefix}ExperienceLogo.png`,
            priceperslot: `${mediaPrefix}PricePerSlotLogo.png`,
            question: `${mediaPrefix}QuestionLogo.png`,
            spawnchance: `${mediaPrefix}SpawnChance.png`,
            exchangerate: `${mediaPrefix}ExchangeLogo.png`,
            pricenotify: `${mediaPrefix}PriceNotifyLogo.png`,
            notifyremove: `${mediaPrefix}NotifyRemoveLogo.png`,
            compare: `${mediaPrefix}CompareLogo.png`,
            roulette: `${mediaPrefix}RouletteLogo.png`,
            chart: `${mediaPrefix}ChartLogo.png`,
            status: `${mediaPrefix}StatusLogo.png`,
            trader: `${mediaPrefix}TraderLogo.png`
        }
    },
    itemArrayLink: `${gistPrefix}58aa8d985e4690b9a540467af30ec909`,
    caliberArrayLink: `${gistPrefix}16c20db88feb4aefd22dbac6e257e290`
}
