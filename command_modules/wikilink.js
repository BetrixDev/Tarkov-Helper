const urlExist = require('url-exist');

const GetWikiLink = async(Item) => {
    let WikiLink = `https://escapefromtarkov.gamepedia.com/${Item.replace('. ', '_-_').replace(' ', '_').split(' ').join('_')}`
    if (await urlExist(WikiLink)) {
        console.log(WikiLink)
        return WikiLink
    }
}

exports.GetWikiLink = GetWikiLink