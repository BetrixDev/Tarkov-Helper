const fs = require('fs')
const got = require('got')

async function GrabAmmo() {
    let query = JSON.stringify({
        query: `{
            itemsByType(type: ammo) {
                id
                name
                wikiLink
                types
            }
        }`
    })
    let response = await got.post('https://tarkov-tools.com/graphql', {
        body: query,
        responseType: 'json',
    })

    return response.body.data.itemsByType.filter(item => {
        return !item.types.includes('grenade')
    })
}

async function GetAmmo() {
    try {
        fs.rmSync('./output', { recursive: true })
    } catch {}
    fs.mkdirSync('./output')

    let ammoList = await GrabAmmo()

    let wikiToId = new Object()
    ammoList.forEach(ammo => {
        if (ammo.wikiLink !== '') {
            wikiToId[ammo.wikiLink] = {
                ...ammo
            }
        } else {
            let wikiLink = `https://escapefromtarkov.fandom.com/wiki/${ammo.name.replaceAll(' ', '_')}`
            wikiToId[wikiLink] = {
                ...ammo
            }
        }
    })

    // Format Wiki Data
    let wikiData = await got('https://escapefromtarkov.fandom.com/api.php?action=query&prop=revisions&titles=Ballistics&rvprop=content&format=json')
    wikiData = JSON.parse(wikiData.body)
    wikiData = wikiData.query.pages['11366'].revisions[0]['*']

    let rawAmmoData = wikiData.split('<br/>')[5].split('[[Category:Escape from Tarkov]]')[0].split('\n')
    let formattedAmmoData = new Object()

    for (let i in rawAmmoData) {
        let line = rawAmmoData[i]
        if (line.startsWith('| rowspan=\"1\" |[[')) {
            let ammoName = line.split('[[')[1].split(']]')[0]

            let ammoData = {
                name: ammoName,
                wikiLink: `https://escapefromtarkov.fandom.com/wiki/${ammoName.replaceAll(' ', '_').replaceAll('"', '%22')}`,
                damage: Number(rawAmmoData[Number(i) + 1].replaceAll('|', '').replaceAll(' ', '')),
                penetration: Number(rawAmmoData[Number(i) + 2].replaceAll('|', '').replaceAll(' ', '')),
                armorDamage: Number(rawAmmoData[Number(i) + 3].replaceAll('|', '').replaceAll(' ', ''))
            }

            if (!ammoData.damage) {
                let damage = rawAmmoData[Number(i) + 1].replaceAll('|', '').replaceAll(' ', '')
                let pellets = Number(damage.split('{{#expr:')[1].split('*')[0])
                let pelletDamage = Number(damage.split(`{{#expr:${pellets}*`)[1].split('}}"')[0])

                ammoData.damage = pelletDamage
                ammoData['pellets'] = pellets
            }

            try {
                let extraData = wikiToId[ammoData.wikiLink]
                formattedAmmoData[extraData.id] = {
                    ...ammoData,
                    id: extraData.id
                }
            } catch {}
        }
    }

    return formattedAmmoData
}

exports.GetAmmo = GetAmmo