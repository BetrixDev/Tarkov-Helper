const MessageUser = (client, uid, message) => {
    client.users.fetch(uid).then((user) => {
        user.send(message)
    })
}

exports.MessageUser = MessageUser