export type MapNames = keyof MapLinks

interface MapLinks {
    thelab: MapLink[]
    interchange: MapLink[]
    woods: MapLink[]
    customs: MapLink[]
    factory: MapLink[]
    reserve: MapLink[]
    shoreline: MapLink[]
    lighthouse: MapLink[]
}

interface MapLink {
    name: string
    link: string
    author: string
}
