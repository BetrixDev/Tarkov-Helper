// // A module to handles button interactions that are self contained with the information used

// import { ButtonInteraction } from 'discord.js'
// import { getData } from '../../Lib'
// import { GuideMessage } from './guide'
// import { Message } from '../commands/priceperslot'

// export const simpleButtons = ['map', 'guide', 'reload', 'priceperslot']

// export async function SimpleButtons(interaction: ButtonInteraction) {
//     const id = interaction.customId.split('__')

//     const commandName = id[0]

//     switch (commandName) {
//         case 'map':
//             const map = id[1]
//             const type = id[2]

//             interaction.reply(MapMessage(map, type))
//             break
//         case 'guide':
//             const quest = id[1]
//             interaction.reply(GuideMessage(Number(quest)))
//             break
//         case 'priceperslot':
//             interaction.deferUpdate()

//             const action = id[1]
//             const page = id[2]

//             const oldData = getData(interaction.user.id, 'priceperslot')
//             const { min, max, items } = oldData

//             if (action == 'backward') {
//                 oldData.interaction.editReply(
//                     await Message(oldData.interaction, { minimum: min, maximum: max }, { items: items, page: Number(page) - 1 })
//                 )
//             } else if (action == 'forward') {
//                 oldData.interaction.editReply(
//                     await Message(oldData.interaction, { minimum: min, maximum: max }, { items: items, page: Number(page) + 1 })
//                 )
//             }
//             break
//         default:
//             interaction.reply({
//                 ephemeral: true,
//                 content: 'There is no associated function with the interaction'
//             })
//             break
//     }
// }
