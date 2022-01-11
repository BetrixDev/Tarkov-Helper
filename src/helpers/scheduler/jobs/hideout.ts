// Retrieves item data from Tarkov-Tools api

import axios from 'axios'
import { request, gql } from 'graphql-request'
import { Logger, WriteJson } from '../../../lib'

const query = gql`
    {
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

export const HideoutGrabber = async () => {
    Logger('Grabbing hideout data...')

    try {
        const reponse = await request('https://tarkov-tools.com/graphql', query)

        WriteJson('./game_data/api/hideoutdata.json', reponse.hideoutModules)

        Logger('Hideout data succesfully retrieved')
    } catch (e) {
        console.log(e)
        Logger('Error retrieving hideout data')
    }
}
