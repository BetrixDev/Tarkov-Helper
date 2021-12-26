// Retrieves item data from Tarkov-Tools api

import axios from 'axios'
import { request, gql } from 'graphql-request'
import { Logger, WriteJson } from '../../../lib'

const query = gql`
    {
        itemsByType(type: any) {
            id
            name
            shortName
            avg24hPrice
            lastLowPrice
            changeLast48h
            width
            height
            gridImageLink
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
    }
`

export const ItemGrabber = async () => {
    Logger('Grabbing item data...')

    try {
        const reponse = await request('https://tarkov-tools.com/graphql', query)

        WriteJson('./game_data/api/itemdata.json', reponse.itemsByType)

        const ammo = await axios('https://raw.githack.com/TarkovTracker/tarkovdata/master/ammunition.json')

        WriteJson('./game_data/api/bulletdata.json', ammo.data)

        Logger('Item data succesfully retrieved')
    } catch (e) {
        console.log(e)
        Logger('Error retrieving item data')
    }
}
