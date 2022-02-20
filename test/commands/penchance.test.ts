import { PenChanceCommand, ErrorMessages, createChart } from '../../src/commands/penchance'
import { CommandInteraction } from 'discord.js'
import { updateData } from '../../src/data/cache'
import { Client } from 'discordx'
import { Item } from '../../src/data/classes/item'
import { BallisticsCalculator } from '../../src/helpers/simulator/ballistics'
import { translation } from '../../src/lib'

const interaction: CommandInteraction = {} as CommandInteraction
const client: Client = {} as Client
const serverData: ServerData = { ServerID: '', Cooldown: 3, ChannelLock: '', Language: 'en' }
const serverDataRU: ServerData = { ServerID: '', Cooldown: 3, ChannelLock: '', Language: 'ru' }

describe('Item command tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should render a penchance chart', async () => {
        const t = translation('en')
        const bullet = new Item('54527ac44bdc2d36668b4567', 'en')
        const armor = new Item('5e4abb5086f77406975c9342', 'en')
        const simulator = new BallisticsCalculator(armor, bullet)

        const chart = await createChart(simulator.durabilityPenchanceData, bullet, armor, t)

        expect(Buffer.isBuffer(chart)).toBeTruthy()
    })
})
