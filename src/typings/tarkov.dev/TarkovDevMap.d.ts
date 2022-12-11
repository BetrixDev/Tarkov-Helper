export interface TarkovDevMap {
    id: string;
    name: string;
    normalizedName: string;
    wiki: string;
    enemies: string[];
    raidDuration: number;
    players: string;
    bosses: MapBoss[];
    nameId: string;
}

export interface MapBoss {
    name: string;
    spawnChance: number;
    spawnLocations: BossLocation[];
    escorts: BossEscort[];
}

interface BossLocation {
    name: string;
    chance: number;
}

interface BossEscort {
    name: string;
    amount: {
        count: number;
        chance: number;
    }[];
}
