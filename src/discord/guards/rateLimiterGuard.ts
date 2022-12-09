import { CommandInteraction } from "discord.js";
import { GuardFunction } from "discordx";
import { round } from "../../lib/util/math";
import { translation } from "../../lib/util/translation";
import logger from "../../logger";
import { BaseCommand } from "../../lib/BaseCommand";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COOLDOWN_LENGTH = 3 * 1000;
const NAMESPACE = "RateLimiter";
const MAX_REQUESTS = 2;

interface LimiterValue {
    requestsLeft: number;
    firstMessage: number;
}

const limiter = new Map<string, LimiterValue>();

const isOwner = (interaction: CommandInteraction) => interaction.guild?.ownerId === interaction.user.id;

export const rateLimiterGuard: GuardFunction<CommandInteraction> = async (arg, client, next, guardData) => {
    const interaction = arg instanceof Array ? arg[0] : arg;

    if (interaction instanceof CommandInteraction && !isOwner(interaction)) {
        const uid = interaction.user.id;

        if (limiter.has(uid)) {
            const userData = limiter.get(uid) as LimiterValue;

            if (userData.requestsLeft > 0) {
                limiter.set(uid, { requestsLeft: userData.requestsLeft - 1, firstMessage: userData.firstMessage });

                next();
                return;
            } else {
                const coolDownTimeLeft = (userData.firstMessage + COOLDOWN_LENGTH - Date.now()) / 1000;
                const language = getLanguage(interaction);

                logger.info(NAMESPACE, `Limiting user for ${coolDownTimeLeft}s`);

                // rate limiting
                interaction.reply({
                    content: translation(language)(
                        "Please wait {0} seconds before making another request",
                        round(coolDownTimeLeft, "00")
                    ),
                    ephemeral: true
                });
            }
        } else {
            limiter.set(uid, { requestsLeft: MAX_REQUESTS, firstMessage: Date.now() });

            setTimeout(() => {
                limiter.delete(uid);
            }, COOLDOWN_LENGTH);

            await next();
        }
    } else {
        // Only rate limit commands and people who aren't owners of the server
        next();
    }
};
