// Retrieves barter data from Tarkov-Tools api

import { writeFileSync } from 'fs'
import { request, gql } from 'graphql-request'
import { Logger } from '../../Lib'

const query = gql`
    {
        barters {
            source
            requiredItems {
                count
                item {
                    name
                    shortName
                    id
                    wikiLink
                    lastLowPrice
                }
            }
            rewardItems {
                count
                item {
                    name
                    shortName
                    id
                    wikiLink
                    lastLowPrice
                }
            }
        }
    }
`

export const BarterGrabber = async () => {
    {
        Logger('Grabbing barter data...')

        try {
            const reponse: Item[] = await request('https://tarkov-tools.com/graphql', query).then((data) => {
                return data.barters
            })

            writeFileSync('./src/data/game/api/barterdata.json', JSON.stringify(reponse, null, 4))

            Logger('Barter data succesfully retrieved')
        } catch (e) {
            console.log(e)
            Logger('Error retrieving barter data')
        }
    }
}
