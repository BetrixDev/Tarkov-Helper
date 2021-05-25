// script from https://github.com/kokarn/tarkov-tools/blob/efcd538d9a7d80801e19da3497cc0d88c34b1ec0/scripts/getdata-nofoodaftermidnight.js#L1

const fs = require('fs');
const path = require('path');

const got = require('got');

const prefixes = [
    '9x18pm_',
    '762x25tt_',
    '9x19_',
    '9x21_',
    '57x28_',
    '46x30_',
    '9x39_',
    '366_',
    '545x39_',
    '556x45_',
    '762x39_',
    '762x51_',
    '762_54R_',
    '127x55_',
];

const URLS = [
    'https://sheet.best/api/sheets/691aa8be-ad49-4882-a5df-4527e0b65019'
];

let tempType = false;
let typeCache = [];

const formatRow = function formatRow(row) {
    const formattedRow = {
        type: row['I stream:                 '] || tempType,
        name: row['1'],
        damage: Number(row['3']),
        penetration: Number(row['4']),
        armorDamage: Number(row['5']),
        fragChance: row['https://www.twitch.tv/nofoodaftermidnight'],
    };

    if (formattedRow.type === 'Mounted Weapons') {
        tempType = formattedRow.type;

        return false;
    }

    if (formattedRow.name.toLowerCase().includes('flashbang')) {
        tempType = formattedRow.type;

        return false;
    }

    if (formattedRow.damage === 0) {
        return false;
    }


    typeCache.push(formattedRow.type);

    for (const prefix of prefixes) {
        formattedRow.name = formattedRow.name.replace(prefix, '');
    }

    formattedRow.name = formattedRow.name.replace(/_/g, ' ');

    tempType = formattedRow.type;

    return formattedRow;
};

const getSheetData = async function getSheetData(url) {
    try {
        const response = await got(url, {
            responseType: 'json',
            timeout: 5000,
        });

        return response;
    } catch (responseError) {
        console.error(responseError);
    }

    return false;
};

const GetAmmoData = async() => {
    let response = false;
    for (let i = 0; i < URLS.length; i = i + 1) {
        response = await getSheetData(URLS[i]);

        if (response) {
            break;
        }
    }

    let started = false;
    let stopped = false;

    const dataset = {
        updated: new Date(),
        data: response.body.map((maybeAmmoType) => {
            if (maybeAmmoType['1'] === 'Ammo Type') {
                started = true;

                return false;
            }

            if (!started) {
                return false;
            }

            if (maybeAmmoType['1'] === null) {
                stopped = true;
            }

            if (stopped) {
                return false;
            }

            return formatRow(maybeAmmoType);
        }).filter(Boolean),
    };

    if (typeof customAmmo !== 'undefined') {
        dataset.data = dataset.data.concat(customAmmo);
    }

    return dataset.data
}

exports.GetAmmoData = GetAmmoData