const Responses = require('../settings.json')

const NotifyMessage = (Trader) => {
    const EmbededMessage = {
        color: Responses.BotSettings.NotifyColor,
        title: `${Trader.charAt(0).toUpperCase() + Trader.slice(1)} is resetting soon!`,
        description: "The reset will be in about 5 minutes",
        thumbnail: {
            url: GetTraderImage(Trader)
        },
        footer: {
            text: `To disable these notifications type \"!th notify remove ${Trader}\"`
        }
    }
    return { embed: EmbededMessage }
}

function GetTraderImage(Trader) {
    if (Trader.toLowerCase() === "prapor") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/prapor.png"
    } else if (Trader.toLowerCase() === "therapist") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/therapist.png"
    } else if (Trader.toLowerCase() === "mechanic") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/mechanic.png"
    } else if (Trader.toLowerCase() === "ragman") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/ragman.png"
    } else if (Trader.toLowerCase() === "skier") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/skier.png"
    } else if (Trader.toLowerCase() === "jaeger") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/jaeger.png"
    } else if (Trader.toLowerCase() === "peacekeeper") {
        return "https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/trader_icons/peacekeeper.png"
    }
}

exports.NotifyMessage = NotifyMessage;