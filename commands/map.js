const { ErrorMessage } = require("../command_modules/errormessage")
const { MapMessage } = require("../command_modules/mapmessage")

module.exports = {
    name: 'map',
    description: 'Returns an image of the map specified',
    execute(message, args) {
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
                        MapMessage('Reserve Extractions', 'https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Extractions.png?raw=true', 'https://escapefromtarkov.gamepedia.com/File:3D_Map_by_loweffortsaltbox.png', message)
                    case 'keys':
                    case 'k':
                        MapMessage('Reserve Keys', 'https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Keys.png?raw=true', 'https://escapefromtarkov.gamepedia.com/File:Keys_and_doors_v3.png', message)
                        break;
                    case undefined:
                        MapMessage('Reserve Default Map', 'https://github.com/BetrixEdits/Tarkov-Helper/blob/master/Assets/Maps/Reserve/Default.png?raw=true', 'https://escapefromtarkov.gamepedia.com/File:Reserve_Map_Translated.png', message)
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