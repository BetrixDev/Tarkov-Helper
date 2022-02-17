import { EmbedFieldData, MessageEmbedImage } from 'discord.js'
import { fetchData } from '../../data/cache'
import { Item } from '../../data/classes/item'
import { TranslationFunction, round } from '../../lib'

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
    format: (value: any, data: RawItemProps, t: TranslationFunction) => string
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

            const { Destructibility } = globals.config.ArmorMaterials[data.ArmorMaterial ?? ''] as ArmorMaterial
            return `${value / Destructibility}`
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
        format: (Width: number, { Height }) => {
            if (!Height || !Width) return 'No size value'

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
    }
]

export const getItemFields = (itemProps: RawItemProps, t: TranslationFunction): EmbedFieldData[] => {
    return (
        itemFields
            .filter(({ gameName }) => itemProps[gameName] !== undefined)
            // Sort fields so the placement is consistent in the message
            .sort((a, b) => (a.displayName < b.displayName ? -1 : 1))
            .map(({ gameName, displayName, format }) => {
                const value = itemProps[gameName]

                return { name: t(displayName), value: format(value, itemProps, t), inline: true }
            })
            // Some format functions return '' to indicate not to show them even though the props matched
            .filter(({ value }) => value !== '')
    )
}

// For some items, we want to display images of their functionality
export const getStatImage = (item: Item): MessageEmbedImage => {
    const itemTypes = item.types

    if (itemTypes.includes('ArmoredEquipment')) {
        return {
            url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/rig_images/${item.id}.png`
        }
    } else if (itemTypes.includes('SpecialScope') && itemTypes.includes('FunctionalMod')) {
        return {
            url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/thermal_ingame/${item.id}.png`
        }
    } else if (itemTypes.includes('SpecialScope') && itemTypes.includes('NightVision')) {
        return {
            url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/nvg_ingame/${item.id}.png`
        }
    } else {
        return {
            url: ''
        }
    }
}
