import axios from 'axios'
import request, { gql } from 'graphql-request'
import { readFileSync, writeFileSync } from 'jsonfile'
import { scheduleJob } from 'node-schedule'
import logger from './config/Logger'
import { RawBarter } from './types/game/Barter'
import { HideoutModule } from './types/game/Hideout'
import { TarkovToolsItem } from './types/game/Item'
import { updateData } from './Cache'
import dotenv from 'dotenv'
import { setStatus } from './Main'

dotenv.config()

const TARKOV_CHANGES_TOKEN = process.env.TARKOV_CHANGES_TOKEN as string

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
                priceRUB
                requirements {
                    type
                    value
                }
            }
            buyFor {
                source
                price
                priceRUB
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

const queryTarkovChanges = async () => {
    await axios('https://api.tarkov-changes.com/v1/items', {
        headers: { AUTH_TOKEN: TARKOV_CHANGES_TOKEN }
    }).then((res) => {
        const data = res.data.results as {
            Name: string
            'Item ID': string
            props: string
        }[]

        // https://stackoverflow.com/questions/4215737/convert-array-to-object
        const formattedData = data.reduce((a, v) => ({ ...a, [v['Item ID']]: JSON.parse(v.props) }), {})

        writeFileSync('./data/itemProps.json', formattedData, { spaces: 4 })
    })
}

const queryTarkovTools = async () => {
    try {
        const { itemsByType, barters, hideoutModules } = await request<Response>(endpoint, query)

        writeFileSync('./data/itemData.json', itemsByType, { spaces: 4 })
        writeFileSync('./data/barterData.json', barters, { spaces: 4 })
        writeFileSync('./data/hideoutData.json', hideoutModules, { spaces: 4 })
    } catch (e) {
        logger.error(Namespace, 'Error grabbing Tarkov.dev data', e)
    }
}

const queryMisc = async () => {
    try {
        await Promise.all(
            links.map(async (l) => {
                const { data } = await axios(l.link)

                writeFileSync(`./data/${l.name}.json`, data, { spaces: 4 })

                return
            })
        )
    } catch (e) {
        logger.error(Namespace, 'Error grabbing misc data', e)
    }
}

export default async () => {
    logger.info(Namespace, 'Grabbing data')

    try {
        await Promise.all([queryTarkovChanges(), queryTarkovTools(), queryMisc()])

        scheduleJob('*/30 * * * *', async () => {
            logger.info(Namespace, `Caching new data`)

            queryTarkovTools().then(() => {
                updateData()
            })
        })

        scheduleJob('*/15 * * * *', async () => {
            // UPDATE EVENT DATA
            setStatus(await getEventData())
        })

        scheduleJob('0 */6 * * *', async () => {
            await Promise.all([queryTarkovChanges(), queryMisc()])
        })
    } catch (e) {
        logger.error(Namespace, 'Error grabbing data', e)
    }

    logger.info(Namespace, 'Successfully retrieved data')
}

export async function getEventData() {
    const response = await axios('https://www.escapefromtarkov.com/cash').then((res) => res.data as string)

    const variables = response.match(/[a-zA-Z] = [0-9]+,/gm)?.filter((i) => i.includes('x') || i.includes('y'))

    if (variables) {
        let current: number | undefined
        let goal: number | undefined

        variables.forEach((v) => {
            if (v.includes('x')) {
                current = Number(v.replace('x = ', '').replace(',', ''))
            } else if (v.includes('y')) {
                goal = Number(v.replace('y = ', '').replace(',', ''))
            }
        })

        if (!current || !goal) {
            return
        }

        const output = { current, goal }

        return output
    }
}
