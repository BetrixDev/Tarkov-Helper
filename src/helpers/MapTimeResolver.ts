// Code adjusted from https://github.com/adamburgess/tarkov-time

import dayjs from 'dayjs'

type Side = 'right' | 'left'

export function hrs(num: number) {
    return 1000 * 60 * 60 * num
}

const tarkovRatio = 7

export function realTimeToTarkovTime(time: Date, side: Side): string {
    const oneDay = hrs(24)
    const russia = hrs(3)
    // Haven't tested with any time zone other than eastern
    const timeZoneOffset = hrs(new Date().getTimezoneOffset() / 60 + 1)

    const offset = russia + (side === 'left' ? 0 : hrs(12))
    const tarkovTime = new Date((timeZoneOffset + offset + time.getTime() * tarkovRatio) % oneDay)

    return dayjs(tarkovTime).format('HH:mm:ss')
}
