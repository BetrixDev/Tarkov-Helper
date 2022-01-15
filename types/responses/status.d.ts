interface ServerStatus {
    currentStatuses: Status[]
    messages: StatusMessage[]
    generalStatus: Status
}

interface Status {
    name: string
    message: string
    status: number
    statusCode: string
}

interface StatusMessage {
    content: string
    time: string
    type: number
    solveTime: string
    statusCode: string
}
