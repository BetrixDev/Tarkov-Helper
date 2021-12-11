import { Interaction } from 'discord.js'
import { PathLike, readFileSync, writeFileSync, createReadStream } from 'fs'
import moment from 'moment-timezone'

export function GetTime(): string {
    return moment().tz('America/New_York').format('MM/DD h:m:s a').toUpperCase()
}

export function Logger(message: string): void {
    console.log(`{ ${GetTime()} }: ${message}`)
}

export function ReadJson(path: PathLike) {
    return JSON.parse(readFileSync(path).toString())
}

export function WriteJson(path: PathLike, data: {} | []) {
    return writeFileSync(path, JSON.stringify(data, null, 4))
}

export async function AdminCheck(interaction: Interaction, adminRole: string): Promise<boolean> {
    try {
        if (interaction.guild) {
            if (interaction.guild.ownerId === interaction.user.id) return true

            const usersRoles = await interaction.guild.members.fetch(interaction.user.id).then((user) => user.roles.cache.map((role) => role.id))
            return usersRoles.some((roleId) => roleId === adminRole)
        }
        return false
    } catch {
        return false
    }
}
