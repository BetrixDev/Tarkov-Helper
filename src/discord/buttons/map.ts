import { ButtonInteraction, CommandInteraction, MessageEmbed } from 'discord.js'
import maps from '../../data/command/mapconfig'
import { CapitalizeWords } from '../../Lib'
import { Map } from '../commands/map'

type ImageData = {
    name: string
    link: string
    author: string
}

const mapImages: { [key: string]: ImageData[] } = maps

type MapData = [
    {
        interaction: CommandInteraction
    },
    Map,
    string
]

export async function Message(interaction: ButtonInteraction, data: MapData) {
    const [i, map, type] = data

    // Format map name to display nicer
    const formattedMapName = CapitalizeWords(map.replace('thelab', 'labs'))

    // Grab selected image and its data from the map array
    const imageData = mapImages[map].find((t) => t.name == type)

    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setImage(imageData?.link ?? '')
                .setTitle(`${formattedMapName} ${type} Map`)
                .setFooter(`Map created by: ${imageData?.author ?? 'unknown'}`)
        ],
        ephemeral: true
    })
}
