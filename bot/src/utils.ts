import { BaseInteraction, EmbedBuilder } from "discord.js";
import { localesSchema, SupportLocale } from "common";

/** Attempts to match the user's selected locale to a supported locale else defaults to "en" */
export const getUserLocale = (interaction: BaseInteraction): SupportLocale => {
  const userLocale = interaction.locale;

  const supportedLocale = localesSchema.safeParse(userLocale);

  if (!supportedLocale.success) {
    return "en";
  }

  return supportedLocale.data;
};

export const formatPrice = new Intl.NumberFormat("en-US").format;

export const embedBuilder = () => new EmbedBuilder().setColor("#101720");
