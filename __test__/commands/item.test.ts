import { ItemCommand, ErrorMessages } from '../../src/commands/item'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { updateData } from '../../src/data/cache'
import { Client } from 'discordx'

const interaction: CommandInteraction = {} as CommandInteraction
const client: Client = {} as Client
const serverData: ServerData = { ServerID: '', Cooldown: 3, ChannelLock: '', Language: 'en' }
const serverDataRU: ServerData = { ServerID: '', Cooldown: 3, ChannelLock: '', Language: 'ru' }

describe('Item command tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should respond with the general message', async () => {
        const response = await new ItemCommand().item('545cdb794bdc2d3a198b456a', interaction, client, serverData)
        if (!response.embeds) throw new Error('Command Did not return embed')

        const embed = response.embeds[0] as MessageEmbed

        expect(embed.title).toEqual('6B43 6A Information')
    })

    it('should respond with the general message in russian', async () => {
        const response = await new ItemCommand().item('544a5caa4bdc2d1a388b4568', interaction, client, serverDataRU)
        if (!response.embeds) throw new Error('Command Did not return embed')

        const embed = response.embeds[0] as MessageEmbed

        expect(embed.title).toEqual('AVS Информация')
    })

    it('should respond with the price message', async () => {
        const response = await new ItemCommand().priceMessage('545cdb794bdc2d3a198b456a', 'en')
        if (!response.embeds) throw new Error('Command Did not return embed')

        const embed = response.embeds[0] as MessageEmbed

        expect(embed.title).toEqual('6B43 6A Price Data')
    })

    it('should respond with the barter message', async () => {
        const response = await new ItemCommand().barterMessage('545cdb794bdc2d3a198b456a', 'en')
        if (!response.embeds) throw new Error('Command Did not return embed')

        const embed = response.embeds[0] as MessageEmbed

        expect(embed.title).toEqual('6B43 6A Barters')
    })

    it('should error with AUTO_COMPLETE_ERROR', async () => {
        try {
            await new ItemCommand().item('', interaction, client, serverData)
        } catch (e) {
            expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
        }
    })
})
