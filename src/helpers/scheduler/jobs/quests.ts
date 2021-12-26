// Retrieves quest data from Tarkov-Tools api

import { writeFileSync } from 'fs'
import { Logger } from '../../../lib'
import axios from 'axios'

export const QuestGrabber = async () => {
    Logger('Grabbing quest data...')

    try {
        const reponse = await axios('https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/quests.json', {
            responseType: 'json'
        }).then((data) => {
            return data.data
        })

        writeFileSync('./game_data/api/questdata.json', JSON.stringify(reponse, null, 4))

        Logger('Quest data succesfully retrieved')
    } catch (e) {
        console.log(e)
        Logger('Error retrieving quest data')
    }
}
