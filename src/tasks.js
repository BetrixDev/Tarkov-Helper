const schedule = require('node-schedule')
const got = require('got')
const fs = require('fs')

const GetDate = () => {
    return Date().split(' G')[0]
}

// Update price data every 10 minutes
const UpdatePrices = schedule.scheduleJob('*/10 * * * *', async function() {
    console.log(`{${GetDate()}}: Updating prices`)

    try {
        const bodyQuery = JSON.stringify({
            query: `{
                itemsByType(type: any) {
                    id
                    name
                    shortName
                    avg24hPrice
                    width
                    height
                    iconLink
                    wikiLink
                    basePrice
                    traderPrices {
                        price
                        trader {
                          name
                        }
                    }
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        let NewPrices = {}

        for (const i in response.body.data.itemsByType) {
            let Item = response.body.data.itemsByType[i]
            Item.PricePerSlot = Math.round(Item.avg24hPrice / (Item.width * Item.height))
            NewPrices[Item.id] = {
                Item
            }
        }
        fs.writeFileSync('./src/game_data/pricedata.json', JSON.stringify(NewPrices, null, 2))

        console.log(`{${GetDate()}}: Updated prices successfully`)

    } catch {
        console.log(`{${GetDate()}}: Error updating prices, waiting till next cycle`)
    }
})

// Update item data every 12 hours
const UpdateItems = schedule.scheduleJob('*/60 * * * *', async function() {
    console.log(`{${GetDate()}}: Updating items`)

    try {
        const bodyQuery = JSON.stringify({
            query: `{
            itemsByType(type: any) {
                name
                shortName
                normalizedName
                id
            }
        }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })
        let ItemData = response.body.data.itemsByType

        let ItemFromName = {}
        let ItemArray = new Array()
        for (const Item in ItemData) {
            let Data = ItemData[Item]
            if (Data.name) {
                ItemFromName[Data.name] = {
                    Name: Data.name,
                    ShortName: Data.shortName,
                    ID: Data.id
                }
                ItemArray.push(Data.name)
            }
        }
        fs.writeFileSync('./src/game_data/itemfromname.json', JSON.stringify(ItemFromName, null, 2))
        fs.writeFileSync('./src/game_data/itemarray.json', JSON.stringify(ItemArray, null, 2))

        console.log(`{${GetDate()}}: Updated items successfully`)

    } catch {
        console.log(`{${GetDate()}}: Error updating items, waiting till next cycle`)
    }

})

// Update quest data every 24 hours
const UpdateQuests = schedule.scheduleJob('@daily', async function() {
    console.log(`{${GetDate()}}: Updating quests`)

    try {
        const bodyQuery = JSON.stringify({
            query: `{
                quests {
                    title
                    wikiLink
                    exp
                    giver {
                        name
                    }
                    turnin {
                        name
                    }
                    unlocks
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })
        let QuestData = response.body.data.quests

        let FormattedData = {}
        for (const Quest in QuestData) {
            FormattedData[QuestData[Quest].title] = QuestData[Quest]
        }
        fs.writeFileSync('./src/game_data/quests.json', JSON.stringify(FormattedData, null, 2))

        let QuestNames = new Array()
        for (const Quest in QuestData) {
            QuestNames.push(QuestData[Quest].title)
        }
        fs.writeFileSync('./src/game_data/questnames.json', JSON.stringify(QuestNames, null, 2))

        console.log(`{${GetDate()}}: Updated quests successfully`)

    } catch {
        console.log(`{${GetDate()}}: Error updating quests, waiting till next cycle`)
    }

})

const StartTasks = () => {
    // Run updates at startup
    UpdatePrices.invoke()
    UpdateItems.invoke()
    UpdateQuests.invoke()

    // Start the intervalled updates
    UpdatePrices.schedule()
    UpdateItems.schedule()
    UpdateQuests.schedule()
}

exports.StartTasks = StartTasks