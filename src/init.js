// Similar to tasks.js but makes one big query instead of multiple
const got = require('got')
const fs = require('fs')

const { GetAmmo } = require('./scripts/ammo')
const RawGameData = require('./game_data/database/templates/items.json')

const bodyQuery = JSON.stringify({
    query: `{
        itemsByType(type: any) {
            id
            name
            shortName
            avg24hPrice
            changeLast48h
            width
            height
            imageLink
            wikiLink
            basePrice
            traderPrices {
                price
                trader {
                  name
                }
            }
            sellFor {
                source
                price
                requirements {
                    type
                    value
                }
            }
            buyFor {
                source
                price
                requirements {
                    type
                    value
                }
            }
            types
        }

        itemsByType(type: any) {
            name
            shortName
            normalizedName
            id
            types
            imageLink
            iconLink
            wikiLink
        }

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

        barters {
            source
            requiredItems {
                count
                item {
                    name
                    shortName
                    id
                    wikiLink
                }
            }
            rewardItems {
                count
                item {
                    name
                    shortName
                    id
                    wikiLink
                }
            }
        }
    }`
})

async function InitData() {
    try {
        let AmmoData = await GetAmmo()

        let ExtraData = await got('https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/quests.json', {
            responseType: 'json',
        })
        ExtraData = ExtraData.body

        let response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        let rawData = response.body.data

        // prices
        let NewPrices = {}

        for (const i in response.body.data.itemsByType) {
            let Item = response.body.data.itemsByType[i]
            Item.PricePerSlot = Math.round(Item.avg24hPrice / (Item.width * Item.height))
            NewPrices[Item.id] = {
                Item
            }
        }

        // itemsByType
        let itemsByType = rawData.itemsByType

        let ItemData = {}
        let ItemFromID = {}
        let ItemFromName = {}
        let ItemFromShortName = {}
        let ItemIDs = new Array()
        let ItemArray = new Array()

        for (const Item of itemsByType) {
            if (Item.name !== undefined) {
                ItemData[Item.id] = {
                    ID: Item.id,
                    Name: Item.name,
                    ShortName: Item.shortName,
                    WikiLink: Item.wikiLink,
                    Types: Item.types,
                    Image: Item.iconLink,
                    RawData: RawGameData[Item.id]
                }
                ItemFromName[Item.name] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemFromShortName[Item.shortName.toLowerCase()] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemFromID[Item.id] = {
                    Name: Item.name,
                    ShortName: Item.shortName,
                    ID: Item.id
                }
                ItemArray.push(Item.name)
                ItemIDs.push(Item.id)
            }
        }

        for (let AmmoID in AmmoData) {
            let Ammo = AmmoData[AmmoID]

            if (ItemData[AmmoID]) {
                if (ItemData[AmmoID].RawData === undefined) {
                    ItemData[AmmoID]['RawData'] = {
                        Data: {
                            Damage: Ammo.damage,
                            ArmorDamage: Ammo.armorDamage,
                            PenetrationPower: Ammo.penetration
                        }
                    }
                } else {
                    ItemData[AmmoID].RawData._props['Damage'] = Ammo.damage
                    ItemData[AmmoID].RawData._props['ArmorDamage'] = Ammo.armorDamage
                    ItemData[AmmoID].RawData._props['PenetrationPower'] = Ammo.penetration
                }
            }
        }

        // quests
        let quests = rawData.quests

        let FormattedData = {}
        for (const Quest in quests) {
            FormattedData[quests[Quest].title] = quests[Quest]
        }

        let QuestNames = new Array()
        for (const Quest in quests) {
            QuestNames.push(quests[Quest].title)
        }

        for (const Quest of ExtraData) {
            let quests = FormattedData[Quest.title]

            try {
                if (Quest.nokappa !== undefined) {
                    quests.Kappa = false
                } else {
                    quests.Kappa = true
                }
                quests.Objectives = Quest.objectives
            } catch {}

        }

        // barters
        let barters = rawData.barters

        let BarterData = {}

        for (const Barter of barters) {
            let Reward = Barter.rewardItems[0]
            let RewardID = Reward.item.id

            if (BarterData[RewardID] === undefined) { BarterData[RewardID] = new Array() }

            let BarterScheme = {
                Trader: Barter.source,
                RequiredItems: new Array(),
                Reward: {
                    Amount: Reward.count,
                    Name: Reward.item.name,
                    ShortName: Reward.item.shortName,
                    ID: RewardID,
                    WikiLink: Reward.item.wikiLink
                }
            }

            for (const Ingredient of Barter.requiredItems) {
                BarterScheme.RequiredItems.push({
                    Amount: Ingredient.count,
                    Name: Ingredient.item.name,
                    ShortName: Ingredient.item.shortName,
                    ID: Ingredient.item.id,
                    WikiLink: Ingredient.item.wikiLink
                })
            }

            BarterData[RewardID].push(BarterScheme)
        }

        try {
            fs.rmSync('./src/game_data/api/', { recursive: true })
            fs.mkdirSync('./src/game_data/api/')
        } catch {}

        fs.writeFileSync('./src/game_data/api/pricedata.json', JSON.stringify(NewPrices, null, 4))
        fs.writeFileSync('./src/game_data/api/itemfromshortname.json', JSON.stringify(ItemFromShortName, null, 4))
        fs.writeFileSync('./src/game_data/api/itemfromname.json', JSON.stringify(ItemFromName, null, 4))
        fs.writeFileSync('./src/game_data/api/itemfromid.json', JSON.stringify(ItemFromID, null, 4))
        fs.writeFileSync('./src/game_data/api/itemdata.json', JSON.stringify(ItemData, null, 4))
        fs.writeFileSync('./src/game_data/api/itemarray.json', JSON.stringify(ItemArray, null, 4))
        fs.writeFileSync('./src/game_data/api/itemids.json', JSON.stringify(ItemIDs, null, 4))
        fs.writeFileSync('./src/game_data/api/quests.json', JSON.stringify(FormattedData, null, 4))
        fs.writeFileSync('./src/game_data/api/questnames.json', JSON.stringify(QuestNames, null, 4))
        fs.writeFileSync('./src/game_data/api/barters.json', JSON.stringify(BarterData, null, 4))

        return 'Done'

    } catch (e) {
        console.error(e)
    }
}

exports.InitData = InitData