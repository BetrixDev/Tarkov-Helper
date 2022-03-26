import { EmbedFieldData, MessageEmbedImage } from 'discord.js'
import { fetchData } from '../../Cache'
import { Item } from '../../lib/game/Item'
import { TranslationFunction, round, capitalizeWords, DATABASE_LOCATION } from '../../Lib'
import { Grid, RawItemProps } from '../../types/game/Item'
import { BallisticsCalculator } from '../../lib/simulator/Ballistics'

interface ArmorMaterial {
    Destructibility: number
    MinRepairDegradation: number
    MaxRepairDegradation: number
    ExplosionDestructibility: number
}

interface ContainerSize {
    width: number
    height: number
}

interface ItemField {
    gameName: keyof RawItemProps
    displayName: string
    format?: (value: any, data: RawItemProps, t: TranslationFunction, item: Item) => string
    position?: number
}

const getContainerSize = (grid: Grid[]) => {
    let containerSize: ContainerSize = { width: 0, height: 0 }

    grid.forEach((cell) => {
        containerSize.width += cell._props.cellsH
        containerSize.height += cell._props.cellsV
    })

    return containerSize
}

const itemFields: ItemField[] = [
    {
        gameName: 'Weight',
        displayName: 'Weight',
        format: (value: number) => `${value}kg`
    },
    {
        gameName: 'StackMaxSize',
        displayName: 'Stack Size',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'InitialSpeed',
        displayName: 'Velocity',
        format: (value: number) => `${value}m/s`
    },
    {
        gameName: 'Damage',
        displayName: 'Damage',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'PenetrationPower',
        displayName: 'Penetration',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'ArmorDamage',
        displayName: 'Armor Damage',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'MaxDurability',
        displayName: 'Durability',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'MaxDurability',
        displayName: 'Effective Durability',
        format: (value: number, data) => {
            const globals = fetchData<any>('globals')

            const armorConfig = globals.config.ArmorMaterials[data.ArmorMaterial ?? ''] as ArmorMaterial
            return `${value / armorConfig?.Destructibility ?? 1}`
        }
    },
    {
        gameName: 'armorClass',
        displayName: 'Armor Level',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'armorZone',
        displayName: 'Armor Zones',
        format: (value: string[]) => value.join('\n')
    },
    {
        gameName: 'speedPenaltyPercent',
        displayName: 'Penalties',
        format: (speedPenaltyPercent: number, { weaponErgonomicPenalty, mousePenalty }, t) => {
            return [
                `${t('Speed: {0}%', speedPenaltyPercent)}`,
                `${t('Ergonomic: {0}%', weaponErgonomicPenalty ?? '')}`,
                `${t('Sensitivity: {0}%', mousePenalty ?? '')}`
            ].join('\n')
        }
    },
    {
        gameName: 'Grids',
        displayName: 'Container Size',
        format: (grid: Grid[], data) => {
            if (grid.length === 0) return ''

            const containerSize = getContainerSize(grid)
            return `${containerSize.width * containerSize.height}`
        }
    },
    {
        gameName: 'Width',
        displayName: 'Size',
        format: (Width: number, { Height }, t) => {
            if (!Height || !Width) return t('No size value')

            return `${Height}x${Width} (${Width * Height})`
        }
    },
    {
        gameName: 'Grids',
        displayName: 'Space Efficiency',
        format: (grid: Grid[], { Width, Height }) => {
            if (grid.length === 0 || !Width || !Height) return ''

            const containerSize = getContainerSize(grid)
            return `${round((containerSize.width * containerSize.height) / (Width * Height), '00')}`
        }
    },
    {
        gameName: 'Recoil',
        displayName: 'Recoil',
        format: (value: number) => `${value}%`
    },
    {
        gameName: 'Ergonomics',
        displayName: 'Ergonomics',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'PenetrationPower',
        displayName: 'zFirst Shot Penetration Chances',
        format: (value: number, data, t, item) => {
            const class2 = new BallisticsCalculator(new Item('5648a7494bdc2d9d488b4583', 'en'), item).currentChance
            const class3 = new BallisticsCalculator(new Item('5b44d22286f774172b0c9de8', 'en'), item).currentChance
            const class4 = new BallisticsCalculator(new Item('5d5d646386f7742797261fd9', 'en'), item).currentChance
            const class5 = new BallisticsCalculator(new Item('5c0e541586f7747fa54205c9', 'en'), item).currentChance
            const class6 = new BallisticsCalculator(new Item('5e4abb5086f77406975c9342', 'en'), item).currentChance

            return [
                t(`Class {0}: {1}%`, 2, round(class2, '00')),
                t(`Class {0}: {1}%`, 3, round(class3, '00')),
                t(`Class {0}: {1}%`, 4, round(class4, '00')),
                t(`Class {0}: {1}%`, 5, round(class5, '00')),
                t(`Class {0}: {1}%`, 6, round(class6, '00'))
            ].join('\n')
        }
    },
    {
        gameName: 'isSecured',
        displayName: 'Secure Container?',
        format: (value: boolean, data, t) => `${value ? t('Yes') : t('No')}`
    },
    {
        gameName: 'explDelay',
        displayName: 'Fuse Time',
        format: (value: number) => `${value}s`
    },
    {
        gameName: 'MinExplosionDistance',
        displayName: 'Explosion Distance',
        format: (value, data) => `${data.MinExplosionDistance}/${data.MaxExplosionDistance}m`
    },
    {
        gameName: 'FragmentsCount',
        displayName: 'Fragment Count',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'Strength',
        displayName: 'Fragment Damage',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'Strength',
        displayName: 'Max Damage',
        format: (value, data) => `${Number(data.FragmentsCount) * Number(data.Strength)}`
    },
    {
        gameName: 'Distortion',
        displayName: 'Distortion',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CompressorTreshold',
        displayName: 'Compressor Treshold',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CompressorAttack',
        displayName: 'Compressor Attack',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CompressorRelease',
        displayName: 'Compressor Release',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CompressorGain',
        displayName: 'Compressor Gain',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CompressorVolume',
        displayName: 'Compressor Volume',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'AmbientVolume',
        displayName: 'Ambient Volume',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'DryVolume',
        displayName: 'Dry Volume',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'CutoffFreq',
        displayName: 'Cutoff Frequency',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'Resonance',
        displayName: 'Resonance',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'RecoilForceUp',
        displayName: 'Vertical Recoil',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'RecoilForceBack',
        displayName: 'Horizontal Recoil',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'weapFireType',
        displayName: 'zFire Modes',
        format: (value: string[]) => value.map((str) => capitalizeWords(str)).join('\n')
    },
    {
        gameName: 'bFirerate',
        displayName: 'Fire Rate',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'Caliber',
        displayName: 'Caliber',
        format: (value: string) => value.replace('Caliber', '')
    },
    {
        gameName: 'weapClass',
        displayName: 'Weapon Type',
        format: (value: string) => capitalizeWords(value)
    },
    {
        gameName: 'Cartridges',
        displayName: 'Mag Size',
        format: (value: any[]) => `${value[0]._max_count}`
    },
    {
        gameName: 'CheckTimeModifier',
        displayName: 'Check Time',
        format: (value: number) => `${value}%`
    },
    {
        gameName: 'LoadUnloadModifier',
        displayName: 'Load/Unload Time',
        format: (value: number) => `+${value}%`
    },
    {
        gameName: 'Loudness',
        displayName: 'Loudness',
        format: (value: number) => `${value !== 0 ? value : ''}`
    },
    {
        gameName: 'buckshotBullets',
        displayName: 'Pellets',
        // Regular bullets have this prop, but we don't want to show it, show we give an empty string if 0
        format: (value: number) => `${value !== 0 ? value : ''}`
    },
    {
        gameName: 'MaximumNumberOfUsage',
        displayName: 'zMax Uses',
        format: (value: number) => `${value}`
    },
    {
        gameName: 'MaximumNumberOfUsage',
        displayName: 'Behind the Lock',
        format: (value: number, data, t, item) => `${new Item(item.id, 'en').keyData?.join('\n')}`
    }
]

export const getItemFields = (item: Item, t: TranslationFunction): EmbedFieldData[] => {
    const itemProps = item.props

    let fields = itemFields
        .filter(({ gameName }) => itemProps[gameName] !== undefined)
        // Sort fields so the placement is consistent in the message
        .sort((a, b) => (a.displayName < b.displayName ? -1 : 1))
        .map(({ gameName, displayName, format }) => {
            const value = itemProps[gameName]

            return {
                // Some fields start with z to make them be placed at the end of the embed, so we remove it
                name: t(displayName.startsWith('z') ? displayName.substring(1) : displayName),
                value: format ? format(value, itemProps, t, item) : `${value}`,
                inline: true
            }
        })
        // Some format functions return '' to indicate not to show them even though the props matched
        .filter(({ value }) => value !== '')

    // Make the length of the array dvisible by 3 so the fields line up nicely
    while (fields.length % 3 !== 0) {
        fields.push({ name: '\u200b', value: '\u200b', inline: true })
    }

    return fields
}

// For some items, we want to display images of their functionality
export const getStatImage = (item: Item): MessageEmbedImage => {
    const itemTypes = item.types

    if (itemTypes.includes('ArmoredEquipment')) {
        return {
            url: `${DATABASE_LOCATION}/images/rig_images/${item.id}.png`
        }
    } else if (itemTypes.includes('SpecialScope') && itemTypes.includes('FunctionalMod')) {
        return {
            url: `${DATABASE_LOCATION}/images/thermal_ingame/${item.id}.png`
        }
    } else if (itemTypes.includes('SpecialScope') && itemTypes.includes('NightVision')) {
        return {
            url: `${DATABASE_LOCATION}/images/nvg_ingame/${item.id}.png`
        }
    } else {
        return {
            url: ''
        }
    }
}
