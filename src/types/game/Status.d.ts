export interface ServerStatus {
    currentStatuses: Status[]
    messages: StatusMessage[]
    generalStatus: Status
}

export interface Status {
    name: string
    message: string
    status: number
    statusCode: string
}

export interface StatusMessage {
    content: string
    time: string
    type: number
    solveTime: string
    statusCode: string
}
