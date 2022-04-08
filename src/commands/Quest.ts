import 'reflect-metadata'
import {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js'
import { ButtonComponent, Client, Discord, Slash, SlashOption } from 'discordx'
import { fetchData } from '../Cache'
import { Quest } from '../lib/game/Quest'
import { autoCompleteResults, questSearchEngine } from '../lib/search_engines/QuestEngine'
import { DATABASE_LOCATION, handleCommandInteraction, THEmbed, translation } from '../Lib'
import { RawQuest } from '../types/game/Quest'

const QUEST_NUMBER = fetchData<RawQuest[]>('questData').length

@Discord()
export abstract class QuestCommand {
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

        // Discord only allows 10 embeds per reponse, and since every image is an embed, sometimes we need to split of the embeds across multiple responses
        const messages = Math.ceil(quest.guideImages.length / 10)

        if (messages === 1) {
            quest.guideImages.forEach((image, i) => {
                message.embeds?.push(
                    new THEmbed()
                        .setTitle(t('Image #{0}', i + 1))
                        .setDescription(image.caption ?? '\u200b')
                        .setImage(image.url)
                        .setFooter({ text: t('Image from the official wiki') })
                )
            })

            await interaction.reply(message)
        } else if (messages > 1) {
            // send initial message
            quest.guideImages.slice(0, 9).forEach((image, i) => {
                message.embeds?.push(
                    new THEmbed()
                        .setTitle(t('Image #{0}', i + 1))
                        .setDescription(image.caption ?? '\u200b')
                        .setImage(image.url)
                        .setFooter({ text: t('Image from the official wiki') })
                )
            })

            await interaction.reply(message)

            for (let i = 1; i <= messages - 1; i++) {
                let extraMessage: InteractionReplyOptions = { embeds: [], ephemeral: true }

                quest.guideImages.slice(i * 9, i * 9 + 9).forEach((image, o) => {
                    extraMessage.embeds?.push(
                        new THEmbed()
                            .setTitle(t('Image #{0}', (o + 10) * i))
                            .setDescription(image.caption ?? '\u200b')
                            .setImage(image.url)
                            .setFooter({ text: t('Image from the official wiki') })
                    )
                })

                await interaction.followUp(extraMessage)
            }
        }
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
