const Responses = require('../settings.json')

const ErrorMessage = (Description, message, Fields) => {
    const EmbededMessage = {
        color: Responses.BotSettings.ErrorColor,
        title: 'Error!',
        description: Description,
        thumbnail: {
            url: Responses.Images.Thumbnails.Error
        },
        fields: Fields,
    }
    message.channel.send({ embed: EmbededMessage })
}

exports.ErrorMessage = ErrorMessage;