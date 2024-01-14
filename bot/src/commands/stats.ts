import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import {
  LooseEmbedField,
  THError,
  embedBuilder,
  getUserLocale,
  handleInteraction,
  inlined,
} from "../utils";
import { trpc } from "../trpc";
import { match } from "ts-pattern";
import { ZERO_WIDTH } from "common";

@Discord()
export abstract class StatsCommand {
  @Slash({
    name: "stats",
    description: "Returns all useful statistics about the specified item",
  })
  async command(
    @SlashOption({
      name: "item",
      description: "Item to get the stats of (start typing to search)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: async (interaction) => {
        handleInteraction(interaction, async () => {
          const userLocale = getUserLocale(interaction);
          const query = interaction.options.getFocused();
          const results = await trpc.items.search.query({
            query,
            locale: userLocale,
          });
          return results.map((r) => ({ name: r.item.name, value: r.item.id }));
        });
      },
    })
    itemInput: string,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => {
      const userLocale = getUserLocale(interaction);
      const validInput = await trpc.items.tryItemInput.query({
        query: itemInput,
      });

      if (!validInput) {
        throw new THError(
          "Invalid item name or id. Please use the auto complete feature for accurate searching"
        );
      }

      const item = await trpc.items.fetchItemData.query({
        itemId: validInput,
        locale: userLocale,
      });

      const fields = match(item.props)
        .returnType<LooseEmbedField[]>()
        .with({ __typename: "ItemPropertiesAmmo" }, (props) => {
          return inlined(
            {
              name: "Armor Damage",
              value: props.armorDamage,
            },
            {
              name: "Damage",
              value: props.damage,
            },
            {
              name: "Caliber",
              value: props.caliber.replace("Caliber", ""),
            },
            {
              name: "Penetration",
              value: props.penetrationPower,
            },
            {
              name: "Recoil",
              value: `${props.recoilModifier * 100}%`,
            },
            {
              name: "Velocity",
              value: `${props.initialSpeed}m/s`,
            }
          );
        })
        .with(
          { __typename: "ItemPropertiesArmor" },
          { __typename: "ItemPropertiesArmorAttachment" },
          { __typename: "ItemPropertiesHelmet" },
          (props) => {
            return inlined(
              {
                name: "Armor Level",
                value: props.class,
              },
              {
                name: "Durability",
                value: props.durability,
              },
              {
                name: "Effective Durability",
                value: props.durability / props.material.destructibility,
              },
              {
                name: "Penalties",
                value: [
                  `Speed: ${props.speedPenalty * 100}%`,
                  `Turn: ${props.turnPenalty * 100}%`,
                  `Ergo: ${props.ergoPenalty}%`,
                ].join("\n"),
              }
            );
          }
        )
        .with(
          { __typename: "ItemPropertiesBackpack" },
          { __typename: "ItemPropertiesChestRig" },
          { __typename: "ItemPropertiesContainer" },
          (props) => {
            const otherFields: LooseEmbedField[] = [];

            if (props.__typename === "ItemPropertiesChestRig" && props.class) {
              otherFields.push({
                name: "Armor Level",
                value: props.class,
              });
              otherFields.push({
                name: "Durability",
                value: props.durability,
              });
              otherFields.push({
                name: "Effective Durability",
                value: props.durability / props.material.destructibility,
              });
              otherFields.push({
                name: "Penalties",
                value: [
                  `Speed: ${props.speedPenalty * 100}%`,
                  `Turn: ${props.turnPenalty * 100}%`,
                  `Ergo: ${props.ergoPenalty}%`,
                ].join("\n"),
              });
            }

            const size = item.width * item.height;

            return inlined(
              {
                name: "Container Size",
                value: `${props.capacity} cells`,
              },
              {
                name: "Size",
                value: `${item.width}x${item.height} (${size})`,
              },
              {
                name: "Space Efficiency",
                value: props.capacity / size,
              },
              ...otherFields
            );
          }
        )
        .with(
          {
            __typename: "ItemPropertiesBarrel",
          },
          {
            __typename: "ItemPropertiesWeaponMod",
          },
          { __typename: "ItemPropertiesMagazine" },
          (props) => {
            const otherFields: LooseEmbedField[] = [];

            if (props.__typename === "ItemPropertiesMagazine") {
              otherFields.push({ name: "Capacity", value: props.capacity });
              otherFields.push({
                name: "Load Mod.",
                value: props.loadModifier,
              });
              otherFields.push({
                name: "Malfunc. Chance",
                value: `${props.malfunctionChance * 100}%`,
              });
            }

            return inlined(
              {
                name: "Recoil",
                value: `${props.recoilModifier * 100}%`,
              },
              {
                name: "Ergonomics",
                value: props.ergonomics,
              },
              ...otherFields
            );
          }
        )
        .with({ __typename: "ItemPropertiesGlasses" }, (props) => {
          const fields: LooseEmbedField[] = [];

          if (props.class > 0) {
            fields.push({
              name: "Armor Level",
              value: props.class,
            });
            fields.push({
              name: "Durability",
              value: props.durability,
            });
            fields.push({
              name: "Effective Durability",
              value: props.durability / props.material.destructibility,
            });
          }

          return inlined(...fields, {
            name: "Blindness Protection",
            value: `${props.blindnessProtection * 100}%`,
          });
        })
        .with({ __typename: "ItemPropertiesGrenade" }, (props) => {
          const fields: LooseEmbedField[] = [
            {
              name: "Grenade Type",
              value: props.type,
            },
            {
              name: "Fuse Delay",
              value: `${props.fuse}s`,
            },
          ];

          if (props.type !== "Smoke") {
            if (props.type! == "Flashbang") {
              fields.push({
                name: "Fragments",
                value: props.fragments,
              });
            }

            fields.push({
              name: "Explosion Radius",
              value: `${props.minExplosionDistance}-${props.maxExplosionDistance}m`,
            });

            fields.push({
              name: "Contusion Radius",
              value: `${props.contusionRadius}m`,
            });
          }

          return inlined(fields);
        })
        .otherwise(() => [{ name: ZERO_WIDTH, value: "**No Specific Stats**" }])
        .map((field) => ({ ...field, value: field.value.toString() }));

      const embed = embedBuilder()
        .setTitle(`${item.shortName} Stats`)
        .setDescription(`[Wiki Link](${item.wikiLink})`)
        .setThumbnail(item.iconLink)
        .setFields(fields);

      return {
        embeds: [embed],
      };
    });
  }
}
