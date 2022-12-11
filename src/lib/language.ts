import { LanguageCode } from "../typings/common";
import { readJson } from "./files";
import { readdirSync } from "fs";
import {
    CommandInteraction,
    MessageComponentInteraction,
    ButtonInteraction,
    AutocompleteInteraction
} from "discord.js";

export type TranslationFunction = (translationKey: string, ...args: Array<string | number>) => string;

const LOCALES: Record<string, Record<string, string>> = readdirSync("./lang/interface").reduce(
    (a, v) => ({ ...a, [v.replace(".json", "")]: readJson(`./lang/interface/${v}`) }),
    {}
);

export const translation = (language: LanguageCode | string): TranslationFunction => {
    const translations = LOCALES[language.split("-")[0]];

    return (str: string, ...args: Array<string | number>) => {
        let text = str;
        if (translations && translations[str]) text = translations[str];

        if (args) {
            args.forEach((arg, i) => {
                text = text.replaceAll(`{${i}}`, arg.toString());
            });
        }

        return text;
    };
};

export const getLanguage = (
    interaction: CommandInteraction | MessageComponentInteraction | ButtonInteraction | AutocompleteInteraction
): LanguageCode => {
    const language = interaction.locale.split("-")[0];

    if (["es", "en"].includes(language)) {
        return language as LanguageCode;
    }

    return "en";
};
