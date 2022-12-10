import "reflect-metadata";
import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    InteractionReplyOptions
} from "discord.js";
import { Discord, Slash, SlashOption, ButtonComponent } from "discordx";
import { container, injectable } from "tsyringe";
import { LanguageCode } from "../../typings/common";
import { BaseCommand } from "../../lib/BaseCommand";
import { QuestSearchEngine } from "../../lib/search_engines/QuestSearchEngine";
import { TarkovDataService } from "../../services/TarkovDataService";
import { translation } from "../../lib/util/translation";
import { Quest } from "../../lib/models/Quest";
import { config } from "../../config";
import { getLanguage } from "../../lib/helpers/getLanguage";

const COMMAND_NAME = "quest";

@Discord()
@injectable()
export class QuestCommand extends BaseCommand {
    constructor(private dataService: TarkovDataService) {
        super();
    }

    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    quest(
        @SlashOption(
            "quest",
            BaseCommand.resolveOptions(COMMAND_NAME, "quest", {
                type: ApplicationCommandOptionType.Integer,
                autocomplete: (interaction: AutocompleteInteraction) => {
                    container.resolve(QuestSearchEngine).handleAutoComplete(interaction);
                }
            })
        )
        id: number,
        interaction: CommandInteraction
    ) {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve) => {
                resolve(this.command(id, getLanguage(interaction)));
            })
        );
    }

    command(id: number, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);

        const questId = this.validateQuestInput(id);

        if (!questId) {
            throw Error(t("Input not valid, please use the auto complete function to complete your search"));
        }

        const quest = new Quest(id, language);

        const buttons: ButtonBuilder[] = [];

        if (quest.guideImages.length > 0) {
            buttons.push(
                new ButtonBuilder()
                    .setLabel(t("Guide Images"))
                    .setCustomId(`guide__${id}__${language}`)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        buttons.push(
            new ButtonBuilder().setLabel(t("Full Guide")).setURL(`${quest.wikiLink}#Guide`).setStyle(ButtonStyle.Link)
        );

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(`${quest.name} - ${quest.trader.name}`)
                    .setDescription(
                        `
                        ${quest.guide
                            .map((str) => `• ${str}`)
                            .join("\n")
                            .slice(0, 3000)}
                        `
                    )
                    .setThumbnail(quest.imageURL ?? null)
                    .setImage(`${config.env.databaseURL}/images/quests/${id}.png`)
            ],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)]
        };
    }

    @ButtonComponent(/^guide__/)
    async button(interaction: ButtonInteraction) {
        const [_, i, language] = interaction.customId.split("__");
        const id = Number(i);

        const quest = new Quest(id, language as LanguageCode);
        const t = translation(language);

        const message: InteractionReplyOptions = { embeds: [], ephemeral: true };

        if (quest.guide.length > 0) {
            message.embeds?.push(
                this.createEmbed()
                    .setTitle(t("Steps"))
                    .setDescription(quest.guide.map((str) => `• ${str}`).join("\n"))
                    .setFooter({ text: t("Text from the official wiki") })
            );
        }

        // Discord only allows 10 embeds per response, and since every image is an embed, sometimes we need to split of the embeds across multiple responses
        const messages = Math.ceil(quest.guideImages.length / 9);

        if (messages === 1) {
            quest.guideImages.forEach((image, i) => {
                message.embeds?.push(
                    this.createEmbed()
                        .setTitle(t("Image #{0}", i + 1))
                        .setDescription(image.caption ?? "\u200b")
                        .setImage(image.url)
                        .setFooter({ text: t("Image from the official wiki") })
                );
            });

            await interaction.reply(message);
        } else if (messages > 1) {
            // send initial message
            quest.guideImages.slice(0, 8).forEach((image, i) => {
                message.embeds?.push(
                    this.createEmbed()
                        .setTitle(t("Image #{0}", i + 1))
                        .setDescription(image.caption ?? "\u200b")
                        .setImage(image.url)
                        .setFooter({ text: t("Image from the official wiki") })
                );
            });

            await interaction.reply(message);

            for (let i = 1; i <= messages - 1; i++) {
                const extraMessage: InteractionReplyOptions = { embeds: [], ephemeral: true };

                quest.guideImages.slice(i * 9, i * 9 + 9).forEach((image, o) => {
                    extraMessage.embeds?.push(
                        this.createEmbed()
                            .setTitle(t("Image #{0}", (o + 10) * i))
                            .setDescription(image.caption ?? "\u200b")
                            .setImage(image.url)
                            .setFooter({ text: t("Image from the official wiki") })
                    );
                });

                await interaction.followUp(extraMessage);
            }
        }
    }

    validateQuestInput(id: number): number | undefined {
        const questData = this.dataService.fetchData("tasks");

        if (questData[id]) {
            return id;
        }

        return;
    }
}
