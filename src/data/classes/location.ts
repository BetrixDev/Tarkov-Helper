import { EmbedFieldData, MessageButton } from 'discord.js'
import { capitalizeWords, translation } from '../../lib'
import { fetchData } from '../cache'

const mapImages = fetchData<MapImageData>('maps')

interface PlayerCount {
    min: number
    max: number
}

export class Location {
    private data: RawMapData
    private language: Languages

    name: string
    playerCount: PlayerCount
    hasInsurance: boolean
    raidTime: number

    constructor(mapName: Maps, language: Languages) {
        const data = fetchData<RawMapData>(mapName)

        this.data = data
        this.language = language

        this.name = capitalizeWords(mapName)
        this.playerCount = { min: data.MinPlayers, max: data.MaxPlayers }
        this.hasInsurance = data.Insurance
        this.raidTime = data.escape_time_limit
    }

    get description(): string {
        // We don't know that map's id so we use the array.find() method
        const mapLocales = Object.values(fetchData<Locales>(this.language).locations).find(
            (m) => m.Name.toLowerCase() === this.name.toLowerCase()
        ) as MapLocale // Typecast to avoid the undefined type that .find() gives

        // Makes the description a quote and shrinks the text if its too long\
        return mapLocales.Description.length > 150
            ? `*${mapLocales.Description.substring(0, 150)}*...`
            : `*${mapLocales.Description}*`
    }

    get exfilInfo(): EmbedFieldData[] {
        const locales = fetchData<Locales>(this.language).interface

        let exits: EmbedFieldData[] = this.data.exits.map((exit) => {
            let extras = [`*Chance:* \`${exit.Chance}%\``, `*Time:* \`${exit.ExfiltrationTime}s\``]

            return {
                name: locales[exit.Name] ?? exit.Name,
                value: extras.join('\n'),
                inline: true
            }
        })

        // Makes the amount of objects in the array divisible by 3 so that they all align in the embed
        while (exits.length % 3 !== 0) {
            exits.push({ name: '\u200b', value: '\u200b', inline: true })
        }

        return exits
    }

    get mapButtons(): MessageButton[] {
        const t = translation(this.language)

        return [
            new MessageButton()
                .setStyle('LINK')
                .setLabel(t('Map Genie'))
                .setURL(`https://mapgenie.io/tarkov/maps/${this.name}`),

            ...mapImages[this.name.toLowerCase()].map((image) =>
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel(t(image.name))
                    .setCustomId(`map__${this.language}__${this.name}__${image.name}`)
            )
        ]
    }
}
