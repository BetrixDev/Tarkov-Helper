import { MessageEmbedOptions } from 'discord.js'
import { ReadJson, Round } from '../../lib'
import { GetDBItem, Cache } from '../game-data'
import { BallisticsCalculator } from '../simulator/ballistics'

let ArmorMaterials = ReadJson<any>('game_data/database/globals.json').config.ArmorMaterials

type THType =
    | 'key'
    | 'rig'
    | 'nvg'
    | 'gun'
    | 'case'
    | 'none'
    | 'shell'
    | 'scope'
    | 'bullet'
    | 'helmet'
    | 'medkit'
    | 'glasses'
    | 'grenade'
    | 'magazine'
    | 'silencer'
    | 'backpack'
    | 'headphone'
    | 'bodyarmor'
    | 'fooddrink'
    | 'attachment'
    | 'armoredrig'
    | 'stimulator'
    | 'faceshield'
    | 'muzzledevice'
    | 'thermalscope'

export class GameStats {
    item: Item
    itemData: { raw: any; locals: any; key?: any; rawName: string }

    constructor(item: Item) {
        this.item = item
        this.itemData = GetDBItem(item.id)
    }

    get description() {
        return `*"${this.itemData.locals.Description.substr(0, 150).concat('...')}"*`
    }

    get canSell(): boolean {
        return this.itemData.raw['CanSellOnRagfair']
    }

    get specificData(): MessageEmbedOptions {
        const globals = Cache.globals
        const data = this.itemData.raw
        const type: THType = GetType(this.item, data, this.itemData.rawName)
        const item = this.item

        if (type == 'armoredrig') {
            const totalSize = data.Height * data.Width
            let containerSize = 0
            data.Grids.forEach((grid: { _props: { cellsH: number; cellsV: number } }) => {
                containerSize += grid._props.cellsH * grid._props.cellsV
            })

            return {
                fields: [
                    {
                        name: 'Size',
                        value: `${data.Height}x${data.Width} (${totalSize})`,
                        inline: true
                    },
                    {
                        name: 'Container Size',
                        value: containerSize.toString(),
                        inline: true
                    },
                    {
                        name: 'Space Efficiency',
                        value: Round(containerSize / totalSize, '00').toString(),
                        inline: true
                    },
                    {
                        name: 'Armor Level',
                        value: data.armorClass,
                        inline: true
                    },
                    {
                        name: 'Durability',
                        value: data.MaxDurability,
                        inline: true
                    },
                    {
                        name: 'Effective Durability',
                        value: Round(
                            data.MaxDurability / globals.config.ArmorMaterials[data.ArmorMaterial].Destructibility,
                            '00'
                        ),
                        inline: true
                    },
                    {
                        name: 'Speed Penalty',
                        value: data.speedPenaltyPercent + '%',
                        inline: true
                    },
                    {
                        name: 'Sensitivity Penalty',
                        value: data.mousePenalty + '%',
                        inline: true
                    },
                    {
                        name: 'Ergonomic Penalty',
                        value: data.weaponErgonomicPenalty + '%',
                        inline: true
                    }
                ],
                image: {
                    url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/rig_images/${item.id}.png`
                }
            }
        } else if (type == 'attachment') {
            return {
                fields: [
                    {
                        name: 'Recoil',
                        value: data.Recoil + '%',
                        inline: true
                    },
                    {
                        name: 'Ergonomics',
                        value: data.Ergonomics,
                        inline: true
                    }
                ]
            }
        } else if (type == 'backpack' || type == 'case' || type == 'rig') {
            const totalSize = data.Height * data.Width
            let containerSize = 0
            data.Grids.forEach((grid: { _props: { cellsH: number; cellsV: number } }) => {
                containerSize += grid._props.cellsH * grid._props.cellsV
            })
            return {
                fields: [
                    {
                        name: 'Size',
                        value: `${data.Height}x${data.Width} (${totalSize})`,
                        inline: true
                    },
                    {
                        name: 'Container Size',
                        value: containerSize.toString(),
                        inline: true
                    },
                    {
                        name: 'Space Efficiency',
                        value: Round(containerSize / totalSize, '00').toString(),
                        inline: true
                    }
                ]
            }
        } else if (type == 'bodyarmor') {
            const destructibility = ArmorMaterials[data.ArmorMaterial].Destructibility
            const effectiveDurability = Round(data.Durability / destructibility, '00')
            const penalties = [
                `Sens: ${data.mousePenalty}%`,
                `Speed: ${data.speedPenaltyPercent}%`,
                `Ergo: ${data.weaponErgonomicPenalty}`
            ]

            return {
                fields: [
                    {
                        name: 'Armor Class',
                        value: data.armorClass,
                        inline: true
                    },
                    {
                        name: 'Durability',
                        value: data.Durability,
                        inline: true
                    },
                    {
                        name: 'Effective Durability',
                        value: effectiveDurability.toString(),
                        inline: true
                    },
                    {
                        name: 'Penalties',
                        value: penalties.join('\n'),
                        inline: true
                    },
                    {
                        name: 'Armor Zones',
                        value: data.armorZone,
                        inline: true
                    },
                    {
                        name: 'Weight',
                        value: `${data.Weight}kg`,
                        inline: true
                    }
                ]
            }
        } else if (type == 'bullet') {
            let class2 = new BallisticsCalculator('5648a7494bdc2d9d488b4583', item.id).CurrentChance // PACA
            let class3 = new BallisticsCalculator('5b44d22286f774172b0c9de8', item.id).CurrentChance // KIRASA
            let class4 = new BallisticsCalculator('5d5d646386f7742797261fd9', item.id).CurrentChance // 6B3TM
            let class5 = new BallisticsCalculator('5c0e541586f7747fa54205c9', item.id).CurrentChance // KILLA
            let class6 = new BallisticsCalculator('5e4abb5086f77406975c9342', item.id).CurrentChance // SLICK

            let penChances = [
                `Class 2: ${Round(class2, '00')}%`,
                `Class 3: ${Round(class3, '00')}%`,
                `Class 4: ${Round(class4, '00')}%`,
                `Class 5: ${Round(class5, '00')}%`,
                `Class 6: ${Round(class6, '00')}%`
            ]

            return {
                fields: [
                    { name: 'Damage', value: data.Damage, inline: true },
                    {
                        name: 'Armor Damage',
                        value: `${data.ArmorDamage}%`,
                        inline: true
                    },
                    {
                        name: 'Penetration',
                        value: data.PenetrationPower,
                        inline: true
                    },
                    {
                        name: 'Velocity',
                        value: `${data.InitialSpeed}m/s`,
                        inline: true
                    },
                    {
                        name: 'Fragment Chance',
                        value: `${Number(data.FragmentationChance) * 100}% (${data.MinFragmentsCount}-${
                            data.MaxFragmentsCount
                        })`,
                        inline: true
                    },
                    { name: 'Malfunction Chance', value: `${Number(data.MalfunctionChance) * 100}%`, inline: true },
                    {
                        name: 'First Shot Penetration Chance',
                        value: penChances,
                        inline: true
                    },
                    { name: 'Stack Size', value: data.StackMaxSize, inline: true }
                ]
            }
        } else if (type == 'faceshield') {
            const destructibility = ArmorMaterials[data.ArmorMaterial].Destructibility
            const effectiveDurability = Round(data.Durability / destructibility, '00')
            const penalties = [
                `Sens: ${data.mousePenalty}%`,
                `Speed: ${data.speedPenaltyPercent}%`,
                `Ergo: ${data.weaponErgonomicPenalty}`
            ]

            return {
                fields: [
                    { name: 'Armor Class', value: data.armorClass, inline: true },
                    { name: 'Durability', value: data.MaxDurability, inline: true },
                    { name: 'Effective Durability', value: effectiveDurability, inline: true },
                    { name: 'Penalties', value: penalties.join('\n'), inline: true },
                    { name: 'Armor Zones', value: data.headSegments, inline: true },
                    { name: 'Blindness Protection', value: data.BlindnessProtection, inline: true }
                ]
            }
        } else if (type == 'glasses') {
            return {
                fields: [{ name: 'Blindness Protection', value: data.BlindnessProtection, inline: true }]
            }
        } else if (type == 'grenade') {
            return {
                fields: [
                    { name: 'Fuse Time', value: data.ExplDelay, inline: true },
                    {
                        name: 'Min/Max Explosion Distance',
                        value: `${data.MinExplosionDistance}/${data.MaxExplosionDistance}m`,
                        inline: true
                    },
                    { name: 'Fragment Count', value: data.FragmentsCount, inline: true },
                    { name: 'Fragment Damage', value: data.Strength, inline: true },
                    { name: 'Max Damage', value: data.FragmentsCount * data.Strength, inline: true },
                    { name: '\u200b', value: '\u200b' }
                ]
            }
        } else if (type == 'headphone') {
            return {
                fields: [
                    { name: 'Distortion', value: data.Distortion, inline: true },
                    { name: 'Compressor Treshold', value: data.CompressorTreshold, inline: true },
                    { name: 'Compressor Attack', value: data.CompressorAttack, inline: true },
                    { name: 'Compressor Release', value: data.CompressorRelease, inline: true },
                    { name: 'Compressor Gain', value: data.CompressorGain, inline: true },
                    { name: 'Cutoff Freq', value: data.CutoffFreq, inline: true },
                    { name: 'Resonance', value: data.Resonance, inline: true },
                    { name: 'Compressor Volume', value: data.CompressorVolume, inline: true },
                    { name: 'Ambient Volume', value: data.AmbientVolume, inline: true },
                    { name: 'Dry Volume', value: data.DryVolume, inline: true }
                ]
            }
        } else if (type == 'gun') {
            return {
                fields: [
                    { name: 'Vertical Recoil', value: data.RecoilForceUp, inline: true },
                    { name: 'Horizontal Recoil', value: data.RecoilForceBack, inline: true },
                    {
                        name: 'FireModes',
                        value: data.weapFireType.map((mode: string) => {
                            return mode[0].toUpperCase() + mode.substring(1)
                        }),
                        inline: true
                    },
                    { name: 'FireRate', value: data.bFirerate, inline: true },
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true },
                    { name: 'Caliber', value: data.ammoCaliber.replace('Caliber', ''), inline: true },
                    {
                        name: 'Weapon Type',
                        value: data.weapClass[0].toUpperCase() + data.weapClass.substr(1),
                        inline: true
                    }
                ]
            }
        } else if (type == 'helmet') {
            const destructibility = ArmorMaterials[data.ArmorMaterial].Destructibility
            const effectiveDurability = Round(data.Durability / destructibility, '00')
            const penalties = [
                `Sens: ${data.mousePenalty}%`,
                `Speed: ${data.speedPenaltyPercent}%`,
                `Ergo: ${data.weaponErgonomicPenalty}`
            ]

            return {
                fields: [
                    { name: 'Armor Class', value: data.armorClass, inline: true },
                    { name: 'Durability', value: data.MaxDurability, inline: true },
                    { name: 'Effective Durability', value: effectiveDurability, inline: true },
                    { name: 'Armor Zones', value: data.headSegments, inline: true },
                    { name: 'Penalties', value: penalties.join('\n'), inline: true }
                ]
            }
        } else if (type == 'key') {
            const keyData = GetDBItem(item.id).key

            if (keyData) {
                return {
                    footer: { text: 'Key data from the wiki' },
                    fields: [{ name: 'Behind the Lock', value: keyData.join('\n') }]
                }
            } else {
                return { fields: [{ name: '\u200b', value: '\u200b' }] }
            }
        } else if (type == 'magazine') {
            return {
                fields: [
                    { name: 'Mag Size', value: data.Cartridges[0]._max_count, inline: true },
                    {
                        name: 'Grid Size',
                        value: `${item.height * item.width} *(${item.width}x${item.height})*`,
                        inline: true
                    },
                    {
                        name: 'Space Efficiency',
                        value: `${data.Cartridges[0]._max_count / (item.height * item.width)}`,
                        inline: true
                    },
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true },
                    { name: 'Recoil', value: `${data.Recoil}%`, inline: true },
                    { name: 'Check Time', value: `+${data.CheckTimeModifier}%`, inline: true },
                    { name: 'Load/Unload Time', value: `+${data.LoadUnloadModifier}%`, inline: true }
                ]
            }
        } else if (type == 'muzzledevice') {
            return {
                fields: [
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true },
                    { name: 'Recoil', value: `${data.Recoil}%`, inline: true },
                    { name: 'Velocity', value: data.Velocity, inline: true }
                ]
            }
        } else if (type == 'silencer') {
            return {
                fields: [
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true },
                    { name: 'Recoil', value: `${data.Recoil}%`, inline: true },
                    { name: 'Velocity', value: data.Velocity, inline: true },
                    { name: 'Loudness', value: data.Loudness, inline: true }
                ]
            }
        } else if (type == 'scope') {
            return {
                fields: [
                    { name: 'Mouse Sensitivities', value: `${data.AimSensitivity[0].join('x\n')}`, inline: true },
                    { name: 'Magnifications', value: `${data.Zooms[0].join('x\n')}`, inline: true },
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true }
                ]
            }
        } else if (type == 'thermalscope') {
            return {
                fields: [
                    { name: 'Ergonomics', value: data.Ergonomics, inline: true },
                    { name: 'Mouse Sensitivities', value: `${data.AimSensitivity[0].join('x\n')}`, inline: true },
                    { name: 'Magnifications', value: `${data.Zooms[0].join('x\n')}`, inline: true }
                ],
                image: {
                    url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/thermal_ingame/${item.id}.png`
                }
            }
        } else if (type == 'shell') {
            return {
                fields: [
                    { name: 'Pellets', value: data.buckshotBullets, inline: true },
                    {
                        name: 'Damage',
                        value: `${data.buckshotBullets * data.Damage} *(${data.buckshotBullets}x${data.Damage})*`,
                        inline: true
                    },
                    { name: 'Penetration', value: data.PenetrationPower, inline: true },
                    { name: 'Armor Damage', value: `${data.ArmorDamage}%`, inline: true },
                    { name: 'Bullet Velocity', value: `${data.InitialSpeed}m/s`, inline: true },
                    { name: 'Stamina Drain On Hit', value: data.StaminaBurnPerDamage, inline: true },
                    { name: 'Fragmentation Chance', value: `${data.FragmentationChance * 100}%`, inline: true }
                    // { name: 'First Shot Penetration Chance', value: penChances, inline: true }
                ]
            }
        } else if (type == 'nvg') {
            return {
                fields: [
                    //{ name: 'Goggle Color', value: `R:${data.Color.r}, G:${data.Color.g}, B:${data.Color.b}`, inline: true },
                    {
                        name: 'Goggle Color',
                        value: `rgb(${data.Color.r}, ${data.Color.g}, ${data.Color.b})`,
                        inline: true
                    },
                    { name: 'Diffuse Intensity', value: data.DiffuseIntensity, inline: true },
                    { name: 'Intensity', value: data.Intensity, inline: true }
                ],
                image: {
                    url: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/nvg_ingame/${item.id}.png`
                },
                footer: {
                    text: 'Night vision image from the wiki'
                }
            }
        }

        return { fields: [{ name: 'No Special Data', value: '\u200b' }] }
    }
}

type RawData = {
    buckshotBullets: number
    Grids: string | any[]
    ContusionDistance: number
    FaceShieldComponent: any
    ItemSound: string
    StimulatorBuffs: string
}

function GetType(item: Item, rawData: RawData, rawName: string): THType {
    const types = item.types

    try {
        if (types.includes('mods')) {
            if (rawName.includes('mag_')) {
                return 'magazine'
            } else if (rawName.includes('silencer_')) {
                return 'silencer'
            } else if (rawName.includes('muzzle_')) {
                return 'muzzledevice'
            } else if (rawName.includes('scope_')) {
                if (item.shortName == 'REAP-IR' || item.shortName == 'FLIR RS-32') {
                    return 'thermalscope'
                } else {
                    return 'scope'
                }
            } else {
                return 'attachment'
            }
        } else if (types.includes('ammo')) {
            if (types.includes('grenade')) {
                return 'grenade'
            } else {
                if (rawData.buckshotBullets > 1) {
                    return 'shell'
                } else {
                    return 'bullet'
                }
            }
        } else if (types.includes('headphones')) {
            return 'headphone'
        } else if (types.includes('armor')) {
            if (rawData.Grids.length > 0) {
                return 'armoredrig'
            } else {
                return 'bodyarmor'
            }
        } else if (types.includes('keys')) {
            return 'key'
        } else if (types.includes('gun')) {
            return 'gun'
        } else if (types.includes('backpack')) {
            return 'backpack'
        } else if (types.includes('grenade')) {
            return 'grenade'
        } else if (types.includes('glasses')) {
            if (rawData.FaceShieldComponent) {
                return 'faceshield'
            } else {
                return 'glasses'
            }
        } else if (types.includes('helmet')) {
            return 'helmet'
        } else if (types.includes('provisions')) {
            if (rawData.ItemSound == 'med_medkit') {
                return 'medkit'
            } else if (
                rawData.ItemSound == 'med_stimulator' ||
                rawData.ItemSound == 'med_pills' ||
                rawData.StimulatorBuffs !== '' ||
                item.shortName == 'Vaseline'
            ) {
                return 'stimulator'
            } else {
                return 'fooddrink'
            }
        } else if (
            (types.includes('wearable') && !types.includes('gun') && !rawName.includes('weapon_')) ||
            rawName == 'ПНВ'
        ) {
            return 'nvg'
        } else if ((types.includes('barter') && types.includes('markedOnly')) || item.shortName == 'S I C C') {
            return 'case'
        } else {
            return 'none'
        }
    } catch {
        return 'none'
    }
}
