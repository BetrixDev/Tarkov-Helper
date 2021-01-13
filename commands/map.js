const { ErrorMessage } = require("../command_modules/errormessage")
const { MapMessage } = require("../command_modules/mapmessage")

const Thumbnail = "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/MapLogo128x128.png"
const AuthorImage = "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK"
const FooterText = "Map image taken from the EFT WIKI"

module.exports = {
    name: 'map',
    description: 'Returns an image of the map specified',
    execute(message, args, Discord) {
        switch (args[0]) {
            case 'customs':
            case 'c':
                switch (args[1]) {
                    case 'extractions':
                    case 'e':
                        MapMessage('Customs Extractions', 'https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Customs/Extractions.png?raw=true', 'https://escapefromtarkov.gamepedia.com/File:CustomsLargeExpansionGloryMonki.png', message)
                        break;
                    case 'stashes':
                    case 's':
                        MapMessage('Customs Stashes', 'https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Customs/Stashes.png?raw=true', 'https://escapefromtarkov.gamepedia.com/File:Customs_Hidden_Stashes.jpg', message)
                        break
                    case undefined:
                        MapMessage('Customs Default Map', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Maps/Customs/Default.png', 'https://escapefromtarkov.gamepedia.com/File:Customs_Map_0.5.4.823.jpg', message)
                        break;
                    default:
                        ErrorMessage('The general map was found, but the specific map was not', message)
                        break;
                }
                break;
            case 'reserve':
            case 'r':
                switch (args[1]) {
                    case 'extractions':
                    case 'e':
                        const newEmbed = new Discord.MessageEmbed()
                            .setColor('#cecdc3')
                            .setAuthor('Tarkov Helper', AuthorImage)
                            .setTitle('Reserve Extractions')
                            .setThumbnail(Thumbnail)
                            .addFields({ name: 'For the full-res image click below', value: '[Full Resolution Image](https://escapefromtarkov.gamepedia.com/File:3D_Map_by_loweffortsaltbox.png)' }, )
                            .setImage('https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Extractions.png?raw=true')
                            .setFooter(FooterText)
                        message.channel.send(newEmbed);
                        break;
                    case 'keys':
                    case 'k':
                        const newEmbed2 = new Discord.MessageEmbed()
                            .setColor('#cecdc3')
                            .setAuthor('Tarkov Helper', AuthorImage)
                            .setTitle('Reserve Keys')
                            .setThumbnail(Thumbnail)
                            .addFields({ name: 'For the full-res image click below', value: '[Full Resolution Image](https://escapefromtarkov.gamepedia.com/File:Keys_and_doors_v3.png)' }, )
                            .setImage('https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Keys.png?raw=true')
                            .setFooter(FooterText)
                        message.channel.send(newEmbed2);
                        break;
                    case undefined:
                        const newEmbed3 = new Discord.MessageEmbed()
                            .setColor('#cecdc3')
                            .setAuthor('Tarkov Helper', AuthorImage)
                            .setTitle('Reserve Default Map')
                            .setThumbnail(Thumbnail)
                            .addFields({ name: 'For the full-res image click below', value: '[Full Resolution Image](https://escapefromtarkov.gamepedia.com/File:Reserve_Map_Translated.png)' }, )
                            .setDescription('Customs Default \nFor more maps of Customs type: \n!map customs {extractions, keys}')
                            .setImage('https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Default.png?raw=true')
                            .setFooter(FooterText)
                        message.channel.send(newEmbed3);
                        break;
                    default:
                        ErrorMessage('The general map was found, but the specific map was not', message)
                        break;
                }
                break;
            case 'interchange':
            case 'i':
                switch (args[1]) {
                    case 'extractions':

                        break;
                    default:
                        ErrorMessage('The general map was found, but the specific map was not', message)
                        break;
                }
                break;
            case 'factory':
            case 'f':
                ErrorMessage('Factory is not yet supported', message) // Will remove once these maps get added
                break;
            case 'labs':
            case 'l':
                ErrorMessage('Labs is not yet supported', message) // Will remove once these maps get added
                break;
            case 'woods':
            case 'w':
                ErrorMessage('Woods is not yet supported', message) // Will remove once these maps get added
                break;
            default:
                ErrorMessage('The input did not match any maps currently available', message)
                break;
        }
    }
}