import axios from 'axios'
import request, { gql } from 'graphql-request'
import { readFileSync, writeFileSync } from 'jsonfile'
import { scheduleJob } from 'node-schedule'
import logger from './config/Logger'
import { RawBarter } from './types/game/Barter'
import { HideoutModule } from './types/game/Hideout'
import { TarkovToolsItem } from './types/game/Item'
import { updateData } from './Cache'

const Namespace = 'Cron'

const links = readFileSync('links.json') as { name: string; link: string }[]

const endpoint = 'https://api.tarkov.dev/graphql'
const query = gql`
    {
        itemsByType(type: any) {
            id
            shortName
            name
            types
            updated
            avg24hPrice
            lastLowPrice
            changeLast48hPercent
            width
            height
            wikiLink
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

        barters {
            source
            requiredItems {
                count
                item {
                    id
                }
            }
            rewardItems {
                count
                item {
                    id
                }
            }
        }

        hideoutModules {
            id
            name
            level
            itemRequirements {
                item {
                    id
                }
                count
            }
            moduleRequirements {
                id
                name
                level
            }
        }
    }
`

interface Response {
    itemsByType: TarkovToolsItem[]
    barters: RawBarter[]
    hideoutModules: HideoutModule[]
}

const queryTarkovTools = async () => {
    try {
        const { itemsByType, barters, hideoutModules } = await request<Response>(endpoint, query)

        writeFileSync('./data/itemData.json', itemsByType, { spaces: 4 })
        writeFileSync('./data/barterData.json', barters, { spaces: 4 })
        writeFileSync('./data/hideoutData.json', hideoutModules, { spaces: 4 })
    } catch (e) {
        logger.error(Namespace, 'Error grabbing Tarkov-Tools data', e)
    }
}

const queryMisc = async () => {
    try {
        for (let l of links) {
            const { data } = await axios(l.link)

            writeFileSync(`./data/${l.name}.json`, data, { spaces: 4 })
        }
    } catch (e) {
        logger.error(Namespace, 'Error grabbing misc data', e)
    }
}

export default async () => {
    logger.info(Namespace, 'Grabbing data')

    try {
        await queryTarkovTools()
        await queryMisc()

        scheduleJob('*/30 * * * *', async () => {
            logger.info(Namespace, `Caching new data`)

            queryTarkovTools().then(() => {
                updateData()
            })
        })

        scheduleJob('0 */6 * * *', async () => {
            queryMisc()
        })
    } catch (e) {
        logger.error(Namespace, 'Error grabbing data', e)
    }

    logger.info(Namespace, 'Successfully retrieved data')
}
