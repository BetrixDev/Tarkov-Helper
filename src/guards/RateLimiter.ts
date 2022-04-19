import 'reflect-metadata'
import { GuardFunction } from 'discordx'
import { CommandInteraction, Interaction } from 'discord.js'
import { round, translation } from '../Lib'

// One the first message from a user, they have a set amount of commands they can issue within a time period before they are on a cooldown

const COOLDOWN_LENGTH = 5 * 1000
const MAX_REQUESTS = 2

interface LimiterValue {
    requestsLeft: number
    firstMessage: number
}

const limiter = new Map<string, LimiterValue>()

const isOwner = (interaction: Interaction) => interaction.guild?.ownerId === interaction.user.id

export const RateLimiterGuard: GuardFunction<CommandInteraction, GuardData> = async (arg, client, next, guardData) => {
    const interaction = arg instanceof Array ? arg[0] : arg

    if (interaction instanceof CommandInteraction && !isOwner(interaction)) {
        const uid = interaction.user.id

        if (limiter.has(uid)) {
            const userData = limiter.get(uid) as LimiterValue

            if (userData.requestsLeft > 0) {
                limiter.set(uid, { requestsLeft: userData.requestsLeft - 1, firstMessage: userData.firstMessage })

                next()
                return
            } else {
                const cooldownTimeLeft = (userData.firstMessage + COOLDOWN_LENGTH - Date.now()) / 1000

                // rate limiting
                interaction.reply({
                    content: translation(guardData.serverData.Language)(
                        '**Cooldown**: Please wait {0} seconds before making another request',
                        round(cooldownTimeLeft, '00')
                    ),
                    ephemeral: true
                })
            }
        } else {
            limiter.set(uid, { requestsLeft: MAX_REQUESTS, firstMessage: Date.now() })

            setTimeout(() => {
                limiter.delete(uid)
            }, COOLDOWN_LENGTH)

            await next()
        }
    } else {
        // Only rate limit commands and people who aren't owners of the server
        next()
    }
}