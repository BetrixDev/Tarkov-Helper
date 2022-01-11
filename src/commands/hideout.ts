import {
    AutocompleteInteraction,
    CommandInteraction,
    EmbedFieldData,
    Interaction,
    InteractionReplyOptions
} from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import SearchEngine from '../helpers/search_engines/hideout-engine'
import { ErrorReponse, Cache, GetItem, THEmbed, FormatPrice, FormatNumber } from '../lib'

@Discord()
export class HideoutCommand {
    @Slash('hideout', { description: 'Retrieve the cost for upgrading a hideout module' })
    async hideout(
        @SlashOption('module', {
            description: 'name of the module to grab.  ex: BitcoinFarm',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString())

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.key }
                    })
                )
            },
            type: 'STRING'
        })
        i: string,
        interaction: CommandInteraction
    ) {
        try {
            const id = Number(i)

            if (id === NaN || id > Cache.hideoutData.length) {
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', interaction)
                )
                return
            }
            interaction.reply(this.message(id, interaction))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(id: number, interaction: Interaction): InteractionReplyOptions {
        const module = Cache.hideoutData.find((m) => m.id === id)
        if (!module) return ErrorReponse('Unable to grab the specified module', interaction)

        const requiredItems = module.itemRequirements.map((i) => {
            return { item: GetItem(i.item.id), count: i.count }
        })

        let totalPrice = 0
        requiredItems.forEach((i) => {
            console.log(i)
            const price =
                i.item.id === '5449016a4bdc2d6f028b456f' // Roubles have a price of 1
                    ? 1
                    : i.item.buyFor.sort((a, b) => {
                          return b.price - a.price
                      })[0].price

            totalPrice += price * i.count
        })

        return {
            embeds: [
                new THEmbed().setTitle(`${module.name} Level ${module.level} Upgrade Requirements`).addFields(
                    {
                        name: 'Items',
                        value:
                            requiredItems.length > 0
                                ? requiredItems
                                      .map((i) => {
                                          return `**x${FormatNumber(i.count)}**[ ${i.item.shortName}](${
                                              i.item.wikiLink
                                          } "${i.item.name}") - ${FormatPrice(
                                              i.item.id === '5449016a4bdc2d6f028b456f'
                                                  ? 1 * i.count
                                                  : i.item.buyFor.sort((a, b) => {
                                                        return b.price - a.price
                                                    })[0].price * i.count
                                          )}`
                                      })
                                      .join('\n')
                                : 'None',
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },
                    {
                        name: 'Total Cost',
                        value: FormatPrice(totalPrice),
                        inline: true
                    },
                    {
                        name: 'Required Modules',
                        value:
                            module.moduleRequirements.length > 0
                                ? module.moduleRequirements
                                      .map((m) => {
                                          return `${m.name} Level ${m.level}`
                                      })
                                      .join('\n')
                                : 'None',
                        inline: true
                    }
                )
            ]
        }
    }
}
