// Retrieves quest data from Tarkov-Tools api

import { writeFileSync } from 'fs'
import { Logger } from '../../Lib'
import got from 'got'

export const QuestGrabber = async () => {
    Logger('Grabbing quest data...')

    try {
        const reponse = await got('https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/quests.json', {
            responseType: 'json'
        }).then((data) => {
            return data.body
        })

        writeFileSync('./game_data/api/questdata.json', JSON.stringify(reponse, null, 4))

        Logger('Quest data succesfully retrieved')
    } catch (e) {
        console.log(e)
        Logger('Error retrieving quest data')
    }
}
