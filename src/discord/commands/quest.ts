import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { ErrorMessage, GetQuest, QuestSearchEngine, QuestSearchMessage, ReadJson } from '../../Lib'
import settings from '../../data/bot/settings'
import { AppendCache } from '../../helpers/Cache'

let QuestGuides: { [key: string]: object } = ReadJson('./src/data/game/questguide.json')

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

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('quest', {
        description: 'Retrieves information about a quest and how to complete it'
    })
    async quest(
        @SlashOption('quest', {
            description: 'Name of the quest',
            required: true
        })
        quest: string,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { quest: any }): Promise<InteractionReplyOptions> => {
    const date = Date.now().toString()
    AppendCache(date, { interaction })
    const result = QuestSearchEngine(args.quest)

    if (result.length >= 25) {
        return {
            embeds: [ErrorMessage('Quest search came back with over 25 results, please be more specific')],
            ephemeral: true
        }
    } else if (result.length > 1) {
        return QuestSearchMessage(args, result)
    }

    const quest = GetQuest(result[0].id)
    const questData = new QuestData(quest)

    let message: InteractionReplyOptions = {
        embeds: [
            new MessageEmbed()
                .setColor(settings.botSettings.color)
                .setTitle(`${quest.title} - ${Traders[Number(quest.giver)]}`)
                .setDescription(questData.description)
        ]
    }

    let buttons = new Array()

    if (QuestGuides[quest.title] !== undefined) {
        buttons.push(new MessageButton().setLabel('Guide').setCustomId(`guide__${date}__${quest.id}`).setStyle('PRIMARY'))
    }

    buttons.push(new MessageButton().setLabel('Full Guide').setURL(`${quest.wiki}#Guide`).setStyle('LINK'))

    message.components = [new MessageActionRow().addComponents(buttons)]

    return message
}

/*
    Data for command
*/

class QuestData {
    //quest: TrackerQuest
    gameID: string

    description: string

    constructor(quest: TrackerQuest) {
        let Locals = ReadJson('./src/data/game/database/locales/global/en.json')

        this.gameID = quest.gameId

        if (this.gameID == 'unknown') {
            this.description = ''
        } else {
            const localObject = Locals.quest[this.gameID]

            this.description = `*"${Locals.mail[localObject.description].substr(0, 150).concat('...')}"*`
        }
    }
}
