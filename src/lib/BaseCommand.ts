import {
    ButtonInteraction,
    CommandInteraction,
    Embed,
    EmbedBuilder,
    Interaction,
    InteractionReplyOptions,
    MessageComponentInteraction
} from "discord.js";
import { translation } from "./util/translation";
import { config } from "../config";
import { readJson } from "./util/files";
import { ApplicationCommandOptions, SlashOptionOptions } from "discordx";
import { container } from "tsyringe";
import { TarkovDataService } from "../services/TarkovDataService";
import { TarkovDevItem } from "../typings/tarkov.dev/TarkovDevItem";
import { LanguageCode } from "../typings/common";
import logger from "../logger";
import { AutocompleteInteraction } from "discord.js";

const NAMESPACE = "BaseCommand";

interface ILocalizationData {
    name: Record<string, string>;
    description: Record<string, string>;
    options: Record<string, Omit<ILocalizationData, "options">>;
}

export class BaseCommand {
    async handleCommandInteraction(
        interaction: CommandInteraction,
        messageFunc: Promise<InteractionReplyOptions | string>
    ): Promise<void> {
        const start = Date.now();
        await messageFunc
            .then(async (response) => {
                logger.info(NAMESPACE, `interaction (${interaction.id}) was fulfilled (${Date.now() - start}ms)`);
                await interaction.reply(response);
            })
            .catch(async (error) => {
                logger.warn(NAMESPACE, `interaction (${interaction.id}) errored (${Date.now() - start}ms)`, error);
                await interaction.reply(this.errorReply(error, interaction));
            });
    }

    /** Retrieves localization data for the command and converts it into a format to make discordx happy */
    static resolveCommandOptions(
        commandName: string,
        otherOptions?: ApplicationCommandOptions
    ): ApplicationCommandOptions {
        const localizationData = readJson<ILocalizationData>(`./lang/commands/${commandName}.json`);

        return {
            nameLocalizations: localizationData.name,
            description: localizationData.description["en-US"],
            descriptionLocalizations: localizationData.description,
            ...otherOptions
        };
    }

    static resolveOptions(
        commandName: string,
        optionName: string,
        otherOptions?: SlashOptionOptions
    ): SlashOptionOptions {
        const localizationData = readJson<ILocalizationData>(`./lang/commands/${commandName}.json`).options[optionName];

        return {
            nameLocalizations: localizationData.name,
            description: localizationData.description["en-US"],
            descriptionLocalizations: localizationData.description,
            ...otherOptions
        };
    }

    errorReply(message: string, interaction: CommandInteraction | Interaction): InteractionReplyOptions {
        const t = translation(interaction.locale);

        if (interaction.isCommand()) {
            const args = interaction.options.data.map((arg) => {
                return `${arg.name}: ${arg.value}`;
            });

            return {
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: config.bot.name })
                        .setColor(config.bot.errorColor)
                        .setTitle(t("The command issued had and error"))
                        .setDescription(`\`${message}\``)
                        .addFields({ name: "Args", value: args.length > 0 ? args.join("\n") : "none" })
                        .setFooter({ text: t("Command issued: {0}", interaction.commandName) })
                ],
                ephemeral: true
            };
        } else {
            return {
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: config.bot.name })
                        .setColor(config.bot.errorColor)
                        .setTitle(t("The command issued had and error"))
                        .setDescription(`\`${message}\``)
                        .setFooter({ text: t("Command issued: {0}", interaction.id) })
                ],
                ephemeral: true
            };
        }
    }

    /** A simple method to generate consistent embeds, and to keep code less repetitive */
    createEmbed(): EmbedBuilder {
        return new EmbedBuilder().setColor("#152424");
    }

    validateItemInput(input: string): [success: true, output: string] | [success: false] {
        const items = container.resolve(TarkovDataService).fetchData("items-tarkov-dev");

        if (items[input]) {
            // the input was a valid item id
            return [true, input];
        }

        const results = Object.values<TarkovDevItem>(items).filter(
            (item) =>
                item.shortName.toLowerCase() == input.toLowerCase() || item.name.toLowerCase() === input.toLowerCase()
        );

        if (results.length !== 1) {
            return [false];
        }

        // the input was either a unique shortname or valid name
        return [true, results[0].id];
    }
}
