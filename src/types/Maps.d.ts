export enum Maps {
    Customs = 'customs',
    Factory = 'factory',
    Interchange = 'interchange',
    Lighthouse = 'lighthouse',
    Reserve = 'reserve',
    Shoreline = 'shoreline',
    Woods = 'woods',
    Labs = 'labs'
}

export interface MapImageData {
    [key: string]: MapImage[]
}

export interface MapImage {
    name: string
    link: string
    author: string
}
