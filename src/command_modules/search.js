let Searches = new Object(null)


function CreateInput(Inputs, cmd, uid) {

    Searches[uid] = {
        Command: cmd,
        Inputs: Inputs
    }

    // Create array to send back
    let Message = new Array()
    for (const i in Inputs) {
        let pos = Number(i) + 1
        Message.push(`\`${pos}\`. ${Inputs[i]}`)
    }

    return Message
}

function RemoveSearch(uid) {
    try {
        delete Searches[uid]
    } catch {}
}

function OpenSearch(uid) {
    if (Searches[uid] !== undefined) {
        return true
    } else {
        return false
    }
}

function GetSearchObj(uid) {
    return Searches[uid]
}

exports.CreateInput = CreateInput
exports.RemoveSearch = RemoveSearch
exports.OpenSearch = OpenSearch
exports.GetSearchObj = GetSearchObj