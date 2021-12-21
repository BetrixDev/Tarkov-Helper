import { ButtonInteraction, CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import path from 'path'
import { GetQuest, Insert, ReadJson, Slice } from '../../Lib'

let QuestGuides = ReadJson(path.join(__dirname, '..', '..', '..', 'game_data', 'questguide.json'))

type Guide = {
    steps?: string[]
    images?: { link: string; text: string }[]
}

type GuideData = [
    {
        interaction: CommandInteraction
    },
    string
]

export async function Message(interaction: ButtonInteraction, data: GuideData) {
    const questID = data[1]

    const quest: TrackerQuest = GetQuest(+questID)
    const guide: Guide = QuestGuides[quest.title]

    let message: InteractionReplyOptions = { embeds: [], ephemeral: true }

    const steps = guide.steps?.map((s) => {
        let step = s

        while (step.includes('[[') && step.includes(']]')) {
            const firstPos = step.indexOf('[[')
            const secondPos = step.indexOf(']]', firstPos)

            step = Slice(step, firstPos)
            step = Slice(step, secondPos)

            const mentionedItem = step
                .substring(firstPos + 1, secondPos - 1)
                .replaceAll(' ', '_')
                .split('|')[0]
            let displayItem = step.substring(firstPos + 1, secondPos - 1).replaceAll(' ', '_')

            if (displayItem.includes('|')) displayItem = displayItem.split('|')[0]

            const itemLink = `(https://escapefromtarkov.fandom.com/wiki/${mentionedItem})`

            step = Insert(step, itemLink, secondPos)
        }

        return `• ${step}`
    })

    message.embeds?.push(
        new MessageEmbed()
            .setTitle('Steps')
            .setDescription(steps?.join('\n') || '')
            .setFooter('Text from the official wiki')
    )

    guide.images?.forEach((image, i) => {
        message.embeds?.push(
            new MessageEmbed()
                .setTitle(`Image #${i + 1}`)
                .setDescription(image?.text ?? '...')
                .setImage(image.link)
                .setFooter('Image from the official wiki')
        )
    })

    interaction.reply(message)
}
