import { Random, GetItemByType } from '../../Lib'

type Result = {
    map?: string
    gun?: Item
    armor?: Item
    helmet?: Item
}

class Randomizer {
    map: string
    gun: Item
    armor: Item
    helmet: Item

    constructor() {
        const maps = ['Customs', 'Factory', 'Interchange', 'Reserve', 'Shoreline', 'Labs', 'Woods']
        const helmets = GetItemByType('helmet')
        const armors = GetItemByType('armor')
        const guns = GetItemByType('gun')

        this.map = maps[Random(0, maps.length)]
        this.helmet = helmets[Random(0, helmets.length)]
        this.armor = armors[Random(0, armors.length)]
        this.gun = guns[Random(0, guns.length)]
    }

    Preset(preset: Result) {
        preset.map !== undefined ? (this.map = preset.map) : ''
        preset.helmet !== undefined ? (this.helmet = preset.helmet) : ''
        preset.gun !== undefined ? (this.gun = preset.gun) : ''
        preset.armor !== undefined ? (this.armor = preset.armor) : ''
    }

    get Results(): Result {
        return {
            gun: this?.gun,
            armor: this?.armor,
            helmet: this?.helmet,
            map: this?.map
        }
    }
}

export { Randomizer, Result }
