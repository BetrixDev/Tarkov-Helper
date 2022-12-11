import "reflect-metadata";
import { Item } from "../models/Item";
import { clamp, random } from "../math";
import { ItemPropertiesAmmo, ItemPropertiesArmor } from "../../typings/tarkov.dev/TarkovDevItem";

interface Result {
    chance: number;
    durability: number;
    penned: boolean;
    rolled: number;
}

interface ArmorData {
    id: string;
    class: number;
    durability: number;
    currentDurability: number;
    destructibility: number;
    resistance: number;
}

interface BulletData {
    id: string;
    penetration: number;
    armorDamage: number;
    damage: number;
}

export class BallisticsCalculator {
    armorData: ArmorData;
    bulletData: BulletData;

    constructor(armor: Item<ItemPropertiesArmor>, bullet: Item<ItemPropertiesAmmo>) {
        this.armorData = {
            id: armor.id,
            class: armor.props.class,
            durability: armor.props.durability,
            currentDurability: armor.props.durability,
            destructibility: armor.props.material.destructibility,
            resistance: 10
        };

        this.bulletData = {
            id: bullet.id,
            penetration: bullet.props.penetrationPower,
            armorDamage: bullet.props.armorDamage,
            damage: bullet.props.damage
        };
    }

    get currentChance(): number {
        let penetrationChance: number;

        const armorData = this.armorData;
        const bulletData = this.bulletData;

        const c = armorData.class;
        const d = (armorData.currentDurability / armorData.durability) * 100;
        const n = bulletData.penetration;

        const a = (121 - 5000 / (45 + d * 2)) * c * armorData.resistance * 0.01;

        if (n < a - 15) {
            penetrationChance = 0;
        } else if (n < a) {
            const f = (x: number) => ((4 / 10) * Math.pow(a - x - 15, 2)) / 100;
            penetrationChance = f(n) * 100;
        } else {
            const f = (x: number) => (100 + x / (0.9 * a - x)) / 100;
            penetrationChance = f(n) * 100;
        }

        return penetrationChance;
    }

    damageArmor(penetrated: boolean): void {
        const bulletArmorDamage = this.bulletData.armorDamage;
        const bulletPenetration = this.bulletData.penetration;

        let armorDamage = 0;

        if (this.armorData.currentDurability <= 0) return;

        if (penetrated) {
            armorDamage =
                (bulletPenetration *
                    bulletArmorDamage *
                    clamp(bulletPenetration / this.armorData.resistance, 0.5, 0.9) *
                    this.armorData.destructibility) /
                100;
        } else {
            armorDamage =
                (bulletPenetration *
                    bulletArmorDamage *
                    clamp(bulletPenetration / this.armorData.resistance, 0.6, 1.1) *
                    this.armorData.destructibility) /
                100;
        }

        if (armorDamage < 1) {
            armorDamage = 1;
        } else {
            armorDamage = Math.round(armorDamage * 100) / 100;
        }

        this.armorData.currentDurability -= armorDamage;
    }

    get durabilityPenchanceData(): { durability: number; penChance: number }[] {
        const data: { durability: number; penChance: number }[] = [];

        const maxDurability = this.armorData.durability;

        for (let i = 0; i < maxDurability; i++) {
            data.push({
                durability: this.armorData.currentDurability,
                penChance: this.currentChance
            });

            this.armorData.currentDurability--;
        }

        return data;
    }

    simulate(): {
        averageShotsToPen: number;
        averageShotsToZero: number;
    } {
        const iterations = 1000;

        const simResults: Result[][] = [];

        for (let i = 0; i < iterations; i++) {
            const result: Result[] = [];

            while (this.armorData.currentDurability > 0) {
                if (this.armorData.currentDurability < 0) this.armorData.currentDurability = 0;

                let penChance = this.currentChance;

                const randomChance = random(1, 100);
                let penned = true;

                if (penChance > randomChance) {
                    this.damageArmor(true);
                } else {
                    this.damageArmor(false);
                    penned = false;
                }

                if (this.armorData.currentDurability < 0) {
                    this.armorData.currentDurability = 0;
                    penChance = 100;
                }

                result.push({
                    chance: penChance,
                    durability: this.armorData.currentDurability,
                    penned,
                    rolled: randomChance
                });
            }

            simResults.push(result);

            this.armorData.currentDurability = this.armorData.durability;
        }

        const report = {
            averageShotsToPen: 0,
            averageShotsToZero: 0
        };

        simResults.forEach((sim) => {
            report.averageShotsToZero += sim.length;

            for (const i in sim) {
                const result = sim[i];
                if (result.penned) {
                    report.averageShotsToPen += Number(i);
                    break;
                }
            }
        });

        report.averageShotsToZero = report.averageShotsToZero / simResults.length;
        report.averageShotsToPen = report.averageShotsToPen / simResults.length;

        return report;
    }

    get stringifiedData(): string {
        return `${this.armorData.id}|${this.bulletData.id}|${this.armorData.currentDurability}`;
    }
}
