const MessageUser = (client, uid, msg) => {
    client.users.fetch(uid).then((user) => {
        user.send(msg).then((message) => {
            return message
        })
    })
}

exports.MessageUser = MessageUser