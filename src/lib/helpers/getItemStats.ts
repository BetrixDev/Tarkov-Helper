import { EmbedField } from "discord.js";
import { config } from "../../config";
import { Item } from "../models/Item";
import { TranslationFunction } from "../util/translation";
import {
    CombinedItemProps,
    ItemPropertiesArmor,
    ItemPropertiesChestRig,
    ItemPropertiesWeapon,
    TarkovDevItemType as ItemType,
    ItemPropertiesContainer,
    ItemPropertiesBackpack,
    ItemPropertiesGrenade
} from "../../typings/TarkovDevItem";
import { round } from "../util/math";
import { BallisticsCalculator } from "../simulators/BallisticsSimulator";
import { ItemPropertiesMagazine } from "../../typings/TarkovDevItem";

// 🍝 spaghetti 🍝

interface ItemField {
    displayName: string;
    propName: CombinedItemProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format?: (value: any, item: Item<never>, t: TranslationFunction) => string;
}

interface ItemStatProps {
    fields: EmbedField[];
    imgURL?: string;
}

export const getItemStats = (item: Item, t: TranslationFunction): ItemStatProps => {
    return {
        fields: getItemFields(item, t),
        imgURL: getItemImage(item)
    };
};

const getItemFields = (item: Item, t: TranslationFunction): EmbedField[] => {
    const itemProps = item.props;

    if (!itemProps) {
        return [];
    }

    const fields = itemFields
        .filter(({ propName }) => propName in itemProps)
        .sort((a, b) => (a.displayName < b.displayName ? -1 : 1))
        .map(({ propName: p, displayName, format }) => {
            const propName = p as unknown as string;

            if (propName in itemProps) {
                const value = (itemProps as Record<string, unknown>)[propName];

                return {
                    // Some fields start with z to make them be placed at the end of the embed, so we remove it
                    name: t(displayName.startsWith("z") ? displayName.substring(1) : displayName),
                    value: format ? format(value, item as Item<never>, t) : `${value}`,
                    inline: true
                };
            } else {
                throw new Error("Unknown error when parsing item stats.");
            }
        })
        .filter((f) => f && "value" in f && f.value !== "");

    // Make the length of the array divisible by 3 so the fields line up nicely
    while (fields.length % 3 !== 0) {
        fields.push({ name: "\u200b", value: "\u200b", inline: true });
    }

    return fields;
};

const itemFields: ItemField[] = [
    {
        propName: "initialSpeed",
        displayName: "Velocity",
        format: (value) => `${value}m/s`
    },
    {
        propName: "damage",
        displayName: "Damage",
        format: (value) => `${value}`
    },
    {
        propName: "penetrationPower",
        displayName: "Penetration",
        format: (value) => `${value}`
    },
    {
        propName: "armorDamage",
        displayName: "Armor Damage",
        format: (value) => `${value}`
    },
    {
        propName: "maxDurability",
        displayName: "Durability",
        format: (value) => `${value}`
    },
    {
        propName: "maxDurability",
        displayName: "Effective Durability",
        format: (_, { props }: Item<ItemPropertiesChestRig>) => {
            if (props.durability && props.material) {
                return `${round(props.durability / props.material.destructibility, "00")}`;
            }
            return "";
        }
    },
    {
        propName: "class",
        displayName: "Armor Level",
        format: (value: number | null) => `${value ?? ""}`
    },
    {
        propName: "zones",
        displayName: "Armor Zones",
        format: (value: string[] | null) => value?.join("\n") ?? ""
    },
    {
        propName: "speedPenalty",
        displayName: "Penalties",
        format: (_, { props }: Item<ItemPropertiesChestRig>, t) => {
            if (props.speedPenalty && props.ergoPenalty && props.turnPenalty) {
                return [
                    `${t("Speed: {0}%", props.speedPenalty)}`,
                    `${t("Ergonomic: {0}%", props.ergoPenalty)}`,
                    `${t("Sensitivity: {0}%", props.turnPenalty)}`
                ].join("\n");
            }

            return "";
        }
    },
    {
        propName: "capacity",
        displayName: "Container Size",
        format: (
            _,
            {
                props
            }: Item<ItemPropertiesChestRig | ItemPropertiesContainer | ItemPropertiesBackpack | ItemPropertiesMagazine>,
            t
        ) => {
            if (props.__typename === ItemType.ItemPropertiesMagazine) {
                return t("{0} Bullets", props.capacity);
            }

            return t("{0} Cells", props.capacity);
        }
    },
    {
        propName: "capacity",
        displayName: "Space Efficiency",
        format: (_, item: Item<ItemPropertiesChestRig | ItemPropertiesContainer | ItemPropertiesBackpack>, t) => {
            const { props, data } = item;

            return `${round(props.capacity / (data.width * data.height), "00")}`;
        }
    },
    {
        propName: "__typename",
        displayName: "Size",
        format: (_, { data }: Item) => {
            return `${data.width}x${data.height} (${data.width * data.height})`;
        }
    },
    {
        propName: "recoilModifier",
        displayName: "Recoil",
        format: (value: number) => `${value}%`
    },
    {
        propName: "ergonomics",
        displayName: "Ergonomics",
        format: (value: number) => `${value}`
    },
    {
        propName: "penetrationPower",
        displayName: "zFirst Shot Penetration Chances",
        format: (_, item: Item<ItemPropertiesWeapon>, t) => {
            const class2 = new BallisticsCalculator(new Item("5648a7494bdc2d9d488b4583", "en"), item as Item<never>)
                .currentChance;
            const class3 = new BallisticsCalculator(new Item("5b44d22286f774172b0c9de8", "en"), item as Item<never>)
                .currentChance;
            const class4 = new BallisticsCalculator(new Item("5d5d646386f7742797261fd9", "en"), item as Item<never>)
                .currentChance;
            const class5 = new BallisticsCalculator(new Item("5c0e541586f7747fa54205c9", "en"), item as Item<never>)
                .currentChance;
            const class6 = new BallisticsCalculator(new Item("5e4abb5086f77406975c9342", "en"), item as Item<never>)
                .currentChance;

            return [
                t(`Class {0}: {1}%`, 2, round(class2, "00")),
                t(`Class {0}: {1}%`, 3, round(class3, "00")),
                t(`Class {0}: {1}%`, 4, round(class4, "00")),
                t(`Class {0}: {1}%`, 5, round(class5, "00")),
                t(`Class {0}: {1}%`, 6, round(class6, "00"))
            ].join("\n");
        }
    },
    {
        propName: "fuse",
        displayName: "Fuse Time",
        format: (value: number) => `${value}s`
    },
    {
        propName: "minExplosionDistance",
        displayName: "Explosion Distance",
        format: (_, { props }: Item<ItemPropertiesGrenade>) =>
            `${props.minExplosionDistance}-${props.maxExplosionDistance}m`
    },
    {
        propName: "fragments",
        displayName: "Fragment Count",
        format: (value: number) => `${value}`
    },
    {
        propName: "defaultPreset",
        displayName: "Vertical Recoil",
        format: (_, { props }: Item<ItemPropertiesWeapon>) => {
            if (!props?.defaultPreset?.properties?.recoilVertical) {
                return "";
            }

            return `${props.defaultPreset.properties.recoilVertical.toString()}`;
        }
    },
    {
        propName: "defaultPreset",
        displayName: "Horizontal Recoil",
        format: (_, { props }: Item<ItemPropertiesWeapon>) => {
            if (!props?.defaultPreset?.properties?.recoilHorizontal) {
                return "";
            }

            return `${props.defaultPreset.properties.recoilHorizontal.toString()}`;
        }
    },
    {
        propName: "fireModes",
        displayName: "zFire Modes",
        format: (value: string[]) => value.join("\n")
    },
    {
        propName: "fireRate",
        displayName: "Fire Rate",
        format: (value: number) => `${value}`
    },
    {
        propName: "caliber",
        displayName: "Caliber",
        format: (value: string) => value.replace("Caliber", "")
    },
    {
        propName: "ammoCheckModifier",
        displayName: "Check Time",
        format: (value: number) => `${value}%`
    },
    {
        propName: "loadModifier",
        displayName: "Load/Unload Time",
        format: (value: number) => `+${value}%`
    },
    {
        propName: "uses",
        displayName: "zMax Uses",
        format: (value: number) => `${value}`
    },
    {
        propName: "uses",
        displayName: "Behind the Lock",
        format: (_, item, t) => {
            const keyData = item.keyData;

            if (!keyData) return "";

            if (keyData.join("\n").length > 900) {
                // removes one element at a time until the length of the string is short enough to fit in the embed field
                const longestPossibleLength = keyData;
                while (longestPossibleLength.join("\n").length > 900) {
                    longestPossibleLength.pop();
                    if (longestPossibleLength.join("\n").length < 900) {
                        break;
                    }
                }

                return [...longestPossibleLength, t("**...And more**")].join("\n");
            }

            return keyData.join("\n");
        }
    }
];

const getItemImage = (item: Item) => {
    const dbURL = config.env.databaseURL;

    switch (item.type) {
        case ItemType.ItemPropertiesNightVision:
            return `${dbURL}/images/nvg_ingame/${item.id}.png`;
        case ItemType.ItemPropertiesChestRig:
            return `${dbURL}/images/rig_images/${item.id}.png`;
    }
};
