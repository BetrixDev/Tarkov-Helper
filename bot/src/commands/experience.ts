import {
  ApplicationCommandOptionType,
  CommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc.js";
import {
  THError,
  embedBuilder,
  formatNumber,
  handleInteraction,
  s3Image,
} from "../utils.js";

@Discord()
export abstract class ExperienceCommand {
  @Slash({
    name: "experience",
    description: "Calculate the experience neeed to reach a certain level",
  })
  async command(
    @SlashOption({
      name: "current",
      description: "Current level; Can also be a experience amount",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      required: true,
    })
    current: number,
    @SlashOption({
      name: "end",
      description: "Level to end at",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 79,
      required: true,
    })
    endLevel: number,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => command(current, endLevel));
  }
}

export async function command(
  current: number,
  endLevel: number
): Promise<InteractionReplyOptions> {
  if (current === endLevel) {
    throw new THError("Both level values may not be the same");
  }

  const [maxLevel, endLevelXp] = await Promise.all([
    trpc.player.maxPlayerLevel.query(),
    trpc.player.experienceForLevel.query({ level: endLevel }),
  ]);

  const maxLevelXp =
    endLevel === maxLevel
      ? endLevelXp
      : await trpc.player.experienceForLevel.query({ level: maxLevel });

  if (current >= maxLevelXp) {
    throw new THError(`Value for current may not exceed ${maxLevelXp - 1}`);
  }

  const embed = embedBuilder()
    .setTitle("Experience Calculator")
    .setThumbnail(s3Image("xp"));

  if (current > maxLevel) {
    return {
      embeds: [
        embed.setFields({
          name: `Experience gap from ${current} to ${endLevel}`,
          value: formatNumber(Math.abs(current - endLevelXp)) + "xp",
        }),
      ],
    };
  } else {
    const currentLevelXp = await trpc.player.experienceForLevel.query({
      level: current,
    });

    return {
      embeds: [
        embed.setFields({
          name: `Experience gap from ${current} to ${endLevel}`,
          value: formatNumber(Math.abs(currentLevelXp - endLevelXp)) + "xp",
        }),
      ],
    };
  }
}
