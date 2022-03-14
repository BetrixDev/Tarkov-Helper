import {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js'
import { ButtonComponent, Client, Discord, Slash, SlashOption } from 'discordx'
import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { fetchData } from '../data/cache'
import { Quest } from '../data/classes/quest'
import { autoCompleteResults, questSearchEngine } from '../helpers/search_engines/quest-engine'
import { DATABASE_LOCATION, handleCommandInteraction, THEmbed, translation } from '../lib'
import { RawQuest } from '../types/game/quest'

const QUEST_NUMBER = fetchData<RawQuest[]>('questData').length

@Discord()
@injectable()
export class QuestCommand {
    @ButtonComponent(/^guide__/)
    async button(interaction: ButtonInteraction) {
        const [_, i, language] = interaction.customId.split('__')
        const id = Number(i)

        const quest = new Quest(id, language as Languages)
        const t = translation(language)

        let message: InteractionReplyOptions = { embeds: [], ephemeral: true }

        if (quest.guide.length > 0) {
            message.embeds?.push(
                new THEmbed()
                    .setTitle(t('Steps'))
                    .setDescription(quest.guide.map((str) => `• ${str}`).join('\n'))
                    .setFooter({ text: t('Text from the official wiki') })
            )
        }

        quest.guideImages.forEach((image, i) => {
            message.embeds?.push(
                new THEmbed()
                    .setTitle(t('Image #{0}', i + 1))
                    .setDescription(image.caption ?? '\u200b')
                    .setImage(image.url)
                    .setFooter({ text: t('Image from the official wiki') })
            )
        })

        interaction.reply(message)
    }

    @Slash('quest', { description: 'Retrieves information about a quest and how to complete it' })
    quest(
        @SlashOption('quest', {
            description: 'name of the quest (start typing to search)',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        i: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((repond, error) => {
                const t = translation(Language)

                const id = Number(i)

                if (id === NaN || id > QUEST_NUMBER) {
                    error('Please use the auto complete function to complete your search')
                    return
                }

                const quest = new Quest(Number(id), Language)

                let message: InteractionReplyOptions = {
                    embeds: [
                        new THEmbed()
                            .setTitle(`${quest.quest.title} - ${quest.giver}`)
                            .setDescription(
                                `
                                ${quest.description}

                                ${quest.guide
                                    .map((str) => `• ${str}`)
                                    .join('\n')
                                    .slice(0, 3000)}
                            `
                            )
                            .setFields({ name: t('Required for Kappa?'), value: t(quest.kappa) })
                            .setThumbnail(quest.questImage ?? '')
                            .setImage(`${DATABASE_LOCATION}/images/quests/${id}.png`)
                    ]
                }

                let buttons = new Array()

                if (quest.guideImages.length > 0) {
                    buttons.push(
                        new MessageButton()
                            .setLabel(t('Guide Images'))
                            .setCustomId(`guide__${id}__${Language}`)
                            .setStyle('PRIMARY')
                    )
                }

                buttons.push(
                    new MessageButton().setLabel(t('Full Guide')).setURL(`${quest.wikiLink}#Guide`).setStyle('LINK')
                )

                message.components = [new MessageActionRow().addComponents(buttons)]

                repond(message)
            })
        )
    }
}
