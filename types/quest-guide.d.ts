interface QuestGuide {
    [key: string]: {
        steps: string[]
        images: {
            link: string
            text: string
        }[]
    }
}
