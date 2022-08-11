import { Grid, ItemProps } from "../../../types/game/ItemProps";
import { BallisticsCalculator } from "../simulators/BallisticsSimulator";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { Item } from "../models/Item";
import { TranslationFunction } from "../util/translation";
import { round } from "../util/math";
import { config } from "../../config";
import { capitalizeWords } from "../util/string";
import { EmbedField, EmbedImageData } from "discord.js";

interface ArmorMaterial {
    Destructibility: number;
    MinRepairDegradation: number;
    MaxRepairDegradation: number;
    ExplosionDestructibility: number;
}

interface ContainerSize {
    width: number;
    height: number;
}

interface ItemField {
    gameName: keyof ItemProps;
    displayName: string;
    format?: (value: any, data: ItemProps, t: TranslationFunction, item: Item) => string;
    position?: number;
}

const getContainerSize = (grid: Grid[]) => {
    const containerSize: ContainerSize = { width: 0, height: 0 };

    grid.forEach((cell) => {
        containerSize.width += cell._props.cellsH;
        containerSize.height += cell._props.cellsV;
    });

    return containerSize;
};

const itemFields: ItemField[] = [
    {
        gameName: "Weight",
        displayName: "Weight",
        format: (value: number) => `${value}kg`
    },
    {
        gameName: "StackMaxSize",
        displayName: "Stack Size",
        format: (value: number) => `${value}`
    },
    {
        gameName: "InitialSpeed",
        displayName: "Velocity",
        format: (value: number) => `${value}m/s`
    },
    {
        gameName: "Damage",
        displayName: "Damage",
        format: (value: number) => `${value}`
    },
    {
        gameName: "PenetrationPower",
        displayName: "Penetration",
        format: (value: number) => `${value}`
    },
    {
        gameName: "ArmorDamage",
        displayName: "Armor Damage",
        format: (value: number) => `${value}`
    },
    {
        gameName: "MaxDurability",
        displayName: "Durability",
        format: (value: number) => `${value}`
    },
    {
        gameName: "MaxDurability",
        displayName: "Effective Durability",
        format: (value: number, data) => {
            const globals = container.resolve(TarkovDataService).fetchData("globals");

            if (data.ArmorMaterial) {
                const armorConfig = globals.config.ArmorMaterials[data.ArmorMaterial];
                return `${value / armorConfig?.Destructibility ?? 1}`;
            }

            return "N/A";
        }
    },
    {
        gameName: "armorClass",
        displayName: "Armor Level",
        format: (value: number) => `${value}`
    },
    {
        gameName: "armorZone",
        displayName: "Armor Zones",
        format: (value: string[]) => value.join("\n")
    },
    {
        gameName: "speedPenaltyPercent",
        displayName: "Penalties",
        format: (speedPenaltyPercent: number, { weaponErgonomicPenalty, mousePenalty }, t) => {
            return [
                `${t("Speed: {0}%", speedPenaltyPercent)}`,
                `${t("Ergonomic: {0}%", weaponErgonomicPenalty ?? "")}`,
                `${t("Sensitivity: {0}%", mousePenalty ?? "")}`
            ].join("\n");
        }
    },
    {
        gameName: "Grids",
        displayName: "Container Size",
        format: (grid: Grid[], data) => {
            if (grid.length === 0) return "";

            const containerSize = getContainerSize(grid);
            return `${containerSize.width * containerSize.height}`;
        }
    },
    {
        gameName: "Width",
        displayName: "Size",
        format: (Width: number, { Height }, t) => {
            if (!Height || !Width) return t("No size value");

            return `${Height}x${Width} (${Width * Height})`;
        }
    },
    {
        gameName: "Grids",
        displayName: "Space Efficiency",
        format: (grid: Grid[], { Width, Height }) => {
            if (grid.length === 0 || !Width || !Height) return "";

            const containerSize = getContainerSize(grid);
            return `${round((containerSize.width * containerSize.height) / (Width * Height), "00")}`;
        }
    },
    {
        gameName: "Recoil",
        displayName: "Recoil",
        format: (value: number) => `${value}%`
    },
    {
        gameName: "Ergonomics",
        displayName: "Ergonomics",
        format: (value: number) => `${value}`
    },
    {
        gameName: "PenetrationPower",
        displayName: "zFirst Shot Penetration Chances",
        format: (value: number, data, t, item) => {
            const class2 = new BallisticsCalculator(new Item("5648a7494bdc2d9d488b4583", "en"), item).currentChance;
            const class3 = new BallisticsCalculator(new Item("5b44d22286f774172b0c9de8", "en"), item).currentChance;
            const class4 = new BallisticsCalculator(new Item("5d5d646386f7742797261fd9", "en"), item).currentChance;
            const class5 = new BallisticsCalculator(new Item("5c0e541586f7747fa54205c9", "en"), item).currentChance;
            const class6 = new BallisticsCalculator(new Item("5e4abb5086f77406975c9342", "en"), item).currentChance;

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
        gameName: "isSecured",
        displayName: "Secure Container?",
        format: (value: boolean, data, t) => `${value ? t("Yes") : t("No")}`
    },
    {
        gameName: "explDelay",
        displayName: "Fuse Time",
        format: (value: number) => `${value}s`
    },
    {
        gameName: "MinExplosionDistance",
        displayName: "Explosion Distance",
        format: (value, data) => `${data.MinExplosionDistance}/${data.MaxExplosionDistance}m`
    },
    {
        gameName: "FragmentsCount",
        displayName: "Fragment Count",
        format: (value: number) => `${value}`
    },
    {
        gameName: "Strength",
        displayName: "Fragment Damage",
        format: (value: number) => `${value}`
    },
    {
        gameName: "Strength",
        displayName: "Max Damage",
        format: (value, data) => `${Number(data.FragmentsCount) * Number(data.Strength)}`
    },
    {
        gameName: "Distortion",
        displayName: "Distortion",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CompressorTreshold",
        displayName: "Compressor Threshold",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CompressorAttack",
        displayName: "Compressor Attack",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CompressorRelease",
        displayName: "Compressor Release",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CompressorGain",
        displayName: "Compressor Gain",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CompressorVolume",
        displayName: "Compressor Volume",
        format: (value: number) => `${value}`
    },
    {
        gameName: "AmbientVolume",
        displayName: "Ambient Volume",
        format: (value: number) => `${value}`
    },
    {
        gameName: "DryVolume",
        displayName: "Dry Volume",
        format: (value: number) => `${value}`
    },
    {
        gameName: "CutoffFreq",
        displayName: "Cutoff Frequency",
        format: (value: number) => `${value}`
    },
    {
        gameName: "Resonance",
        displayName: "Resonance",
        format: (value: number) => `${value}`
    },
    {
        gameName: "RecoilForceUp",
        displayName: "Vertical Recoil",
        format: (value: number) => `${value}`
    },
    {
        gameName: "RecoilForceBack",
        displayName: "Horizontal Recoil",
        format: (value: number) => `${value}`
    },
    {
        gameName: "weapFireType",
        displayName: "zFire Modes",
        format: (value: string[]) => value.map((str) => capitalizeWords(str)).join("\n")
    },
    {
        gameName: "bFirerate",
        displayName: "Fire Rate",
        format: (value: number) => `${value}`
    },
    {
        gameName: "Caliber",
        displayName: "Caliber",
        format: (value: string) => value.replace("Caliber", "")
    },
    {
        gameName: "weapClass",
        displayName: "Weapon Type",
        format: (value: string) => capitalizeWords(value)
    },
    {
        gameName: "Cartridges",
        displayName: "Mag Size",
        format: (value: any[]) => `${value[0]._max_count}`
    },
    {
        gameName: "CheckTimeModifier",
        displayName: "Check Time",
        format: (value: number) => `${value}%`
    },
    {
        gameName: "LoadUnloadModifier",
        displayName: "Load/Unload Time",
        format: (value: number) => `+${value}%`
    },
    {
        gameName: "Loudness",
        displayName: "Loudness",
        format: (value: number) => `${value !== 0 ? value : ""}`
    },
    {
        gameName: "buckshotBullets",
        displayName: "Pellets",
        // Regular bullets have this prop, but we don't want to show it, show we give an empty string if 0
        format: (value: number) => `${value !== 0 ? value : ""}`
    },
    {
        gameName: "MaximumNumberOfUsage",
        displayName: "zMax Uses",
        format: (value: number) => `${value}`
    },
    {
        gameName: "MaximumNumberOfUsage",
        displayName: "Behind the Lock",
        format: (value: number, data, t, item) => {
            const keyData = new Item(item.id, "en").keyData;

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

export const getItemFields = (item: Item, t: TranslationFunction): EmbedField[] => {
    const itemProps = item.props;

    let fields = itemFields
        .filter(({ gameName }) => itemProps[gameName] !== undefined)
        // Sort fields so the placement is consistent in the message
        .sort((a, b) => (a.displayName < b.displayName ? -1 : 1))
        .map(({ gameName, displayName, format }) => {
            const value = itemProps[gameName];

            return {
                // Some fields start with z to make them be placed at the end of the embed, so we remove it
                name: t(displayName.startsWith("z") ? displayName.substring(1) : displayName),
                value: format ? format(value, itemProps, t, item) : `${value}`,
                inline: true
            };
        })
        // Some format functions return '' to indicate not to show them even though the props matched
        .filter(({ value }) => value !== "");

    // Make the length of the array divisible by 3 so the fields line up nicely
    while (fields.length % 3 !== 0) {
        fields.push({ name: "\u200b", value: "\u200b", inline: true });
    }

    return fields;
};

// For some items, we want to display images of their functionality
export const getStatImage = (item: Item): EmbedImageData | { url: null } => {
    const itemTypes = item.types;
    const databaseURL = config.env.databaseURL;

    if (itemTypes.includes("armor") && itemTypes.includes("rig")) {
        // Armored rig image
        return {
            url: `${databaseURL}/images/rig_images/${item.id}.png`
        };
    } else if (item.name.toLocaleLowerCase().includes("thermal")) {
        // Thermal device image
        return {
            url: `${databaseURL}/images/thermal_ingame/${item.id}.png`
        };
    } else if (itemTypes.includes("mods") && itemTypes.includes("wearable")) {
        // Night vision device image
        return {
            url: `${databaseURL}/images/nvg_ingame/${item.id}.png`
        };
    } else {
        // No special image, return an empty string
        return {
            url: null
        };
    }
};
