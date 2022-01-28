import 'reflect-metadata'
import { ButtonComponent, Discord, Slash, SlashOption } from 'discordx'
import {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js'
import { ErrorReponse, GetQuest, ReadJson, THEmbed } from '../lib'
import SearchEngine from '../helpers/search_engines/quest-engine'

let QuestGuides = ReadJson<QuestGuide>('game_data/questguide.json')

enum Traders {
    'Prapor',
    'Therapist',
    'Skier',
    'Peackeeper',
    'Mechanic',
    'Ragman',
    'Jaeger',
    'Fence'
}

@Discord()
export class QuestCommand {
    @Slash('quest', { description: 'Retrieves information about a quest and how to complete it' })
    quest(
        @SlashOption('quest', {
            description: 'name of the quest (start typing to search)',
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString())

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.id }
                    })
                )
            },
            type: 'STRING'
        })
        id: string,
        interaction: CommandInteraction
    ) {
        try {
            if (Number(id) === NaN) {
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', interaction)
                )
                return
            }

            interaction.reply(this.message(Number(id)))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(id: number) {
        const quest = GetQuest(id)
        const questData = new QuestData(quest)

        let message: InteractionReplyOptions = {
            embeds: [
                new THEmbed()
                    .setTitle(`${quest.title} - ${Traders[Number(quest.giver)]}`)
                    .setDescription(
                        `
                    ${questData.description}

                    ${QuestGuides[quest.title].steps
                        .map((str) => `• ${str}`)
                        .join('\n')
                        .slice(0, 3000)}

                    
                    ${QuestGuides[quest.title]?.images[0]?.text ?? ''}
                    `
                    )
                    .setFields({ name: 'Required for Kappa?', value: quest.nokappa === true ? 'no' : 'yes' })
                    .setImage(QuestGuides[quest.title]?.images[0]?.link ?? '')
            ]
        }

        let buttons = new Array()

        if (QuestGuides[quest.title] !== undefined) {
            buttons.push(
                new MessageButton().setLabel('Guide Images').setCustomId(`guide__${quest.id}`).setStyle('PRIMARY')
            )
        }

        buttons.push(new MessageButton().setLabel('Full Guide').setURL(`${quest.wiki}#Guide`).setStyle('LINK'))

        message.components = [new MessageActionRow().addComponents(buttons)]

        return message
    }

    @ButtonComponent(/^guide__/)
    async mapButton(interaction: ButtonInteraction) {
        const [_, i] = interaction.customId.split('__')
        const index = Number(i)

        const quest: TrackerQuest = GetQuest(index)
        const guide = QuestGuides[quest.title]

        let message: InteractionReplyOptions = { embeds: [], ephemeral: true }

        message.embeds?.push(
            new THEmbed()
                .setTitle(`Steps`)
                .setDescription(guide.steps.join('\n'))
                .setFooter('Text from the official wiki')
        )

        guide.images?.forEach((image, i) => {
            message.embeds?.push(
                new THEmbed()
                    .setTitle(`Image #${i + 1}`)
                    .setDescription(image?.text ?? '...')
                    .setImage(image.link)
                    .setFooter('Image from the official wiki')
            )
        })

        interaction.reply(message)
    }
}

class QuestData {
    gameID: string

    description: string

    constructor(quest: TrackerQuest) {
        let Locals = ReadJson<any>('./game_data/database/locales/global/en.json')

        this.gameID = quest.gameId

        if (this.gameID == 'unknown') {
            this.description = ''
        } else {
            const localObject = Locals.quest[this.gameID]

            this.description = `*"${Locals.mail[localObject.description].substr(0, 150).concat('...')}"*`
        }
    }
}
