import { CommandInteraction, Interaction, InteractionReplyOptions, Message, MessageEmbed } from "discord.js";
import { translation } from "./util/translation";
import { config } from "../config";
import { readJson } from "./util/files";
import { ApplicationCommandOptions, SlashOptionOptions } from "discordx";
import { container } from "tsyringe";
import { TarkovDataService } from "../services/TarkovDataService";
import { TarkovDevItem } from "../../types/tarkov.dev/TarkovDevItem";
import { LanguageCode } from "../../types/common";

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
        await messageFunc
            .then(async (response) => {
                await interaction.reply(response);
            })
            .catch(async (error) => {
                console.log(error);
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

    errorReply(message: string, interaction: Interaction): InteractionReplyOptions {
        const t = translation(interaction.locale);

        if (interaction.isCommand()) {
            const args = interaction.options.data.map((arg) => {
                return `${arg.name}: ${arg.value}`;
            });

            return {
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: config.bot.name })
                        .setColor(config.bot.errorColor)
                        .setTitle(t("The command issued had and error"))
                        .setDescription(`\`${message}\``)
                        .addField("Args", args.length > 0 ? args.join("\n") : "none")
                        .setFooter({ text: t("Command issued: {0}", interaction.commandName) })
                ],
                ephemeral: true
            };
        } else {
            return {
                embeds: [
                    new MessageEmbed()
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
    createEmbed(): MessageEmbed {
        return new MessageEmbed().setColor("#152424");
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

    /** Simple macro function for the appropriate language from an interaction */
    getLanguage(interaction: Interaction): LanguageCode {
        return interaction.locale.split("-")[0] as LanguageCode;
    }
}
