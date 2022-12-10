import {
    CommandInteraction,
    MessageComponentInteraction,
    ButtonInteraction,
    AutocompleteInteraction
} from "discord.js";
import { LanguageCode } from "../../typings/common";

export const getLanguage = (
    interaction: CommandInteraction | MessageComponentInteraction | ButtonInteraction | AutocompleteInteraction
): LanguageCode => {
    const language = interaction.locale.split("-")[0];

    if (["es", "en"].includes(language)) {
        return language as LanguageCode;
    }

    return "en";
};
