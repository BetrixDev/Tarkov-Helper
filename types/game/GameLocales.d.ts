export interface GameLocales {
    interface: { [key: string]: string };
    enum: any[];
    error: Error;
    mail: { [key: string]: string };
    quest: Record<
        string,
        {
            name: string;
            description: string;
            note: string;
            failMessageText: string;
            startedMessageText: string;
            successMessageText: string;
            location: string;
            conditions: { [key: string]: string };
        }
    >;
    preset: { [key: string]: Preset };
    handbook: { [key: string]: string };
    season: Season;
    customization: { [key: string]: Customization };
    repeatableQuest: { [key: string]: string };
    templates: { [key: string]: Template };
    locations: Record<string, LocationLocale>;
    banners: Banners;
    trading: { [key: string]: Trading };
}

interface Banners {
    the5464E0404Bdc2D2A708B4567: The5464_E0404Bdc2D2A708B4567;
    the5464E0454Bdc2D06708B4567: The5464_E0404Bdc2D2A708B4567;
    the5807Be8924597742C603Fa19: The5464_E0404Bdc2D2A708B4567;
    the5805F617245977100B2C1F41: The5464_E0404Bdc2D2A708B4567;
    the5803A58524597710Ca36Fcb2: The5464_E0404Bdc2D2A708B4567;
    the5807Bfe124597742A92E0A4C: The5464_E0404Bdc2D2A708B4567;
    the5807C3F124597746Bf2Db2Ce: The5464_E0404Bdc2D2A708B4567;
    the5C1B857086F77465F465Faa4: The5C1B857086F77465F465Faa4;
}

interface LocationLocale {
    Name: string;
    Description: string;
}

interface The5C1B857086F77465F465Faa4 {
    name: string;
    shortName: string;
    description: string;
    the5C1B857086F77465F465Faa4Description: string;
    the5C1B857086F77465F465Faa4Name: string;
}

interface Error {
    offerNotFound: string;
    transactionErrorTheCostOfGoodsHasAlreadyChanged: string;
    notEnoughSpaceInStash: string;
    attemptedTransactionWithItemsMissingFromTheStash: string;
    badUserLoyaltyLevel: string;
    theTraderIsOutOfCash: string;
    unknownError: string;
    traderDoesNotDealInThisTypeOfItems: string;
    youHaveAlreadyBoughtTheMaximumAmountOfThisItemInTheCurrentRestock: string;
    theTraderIsOutOfStock: string;
    theItemIsAlreadySold: string;
    the230MaxLoginCount: string;
    the1514TransactionErrorTheCostOfGoodsHasAlreadyChanged: string;
    the201ClientNotAuthorizedOrNotSelectedGameProfile: string;
    backendErrorMessage: string;
    backendErrorHeader: string;
    backendErrorUnknownError: string;
}

interface The55_F2D3Fd4Bdc2D5F408B4567 {
    name: string;
    description: string;
}

interface Preset {
    name: null | string;
}

interface Season {
    the5Be3Dd9C88A4504Fbc1670A5: string;
    the5C0559D388A450481C1F62B8: string;
    the5C5171Df88A4505C2D656Cd9: string;
    the5Ce3Ff7D88A4501De86Aa707: string;
    the5Fe8C7B76C0Ea413171B4271: string;
}

interface Template {
    Name: string;
    ShortName: number | string;
    Description: string;
    casingName?: string;
    rigLayoutName?: string;
    foldedSlot?: string;
}

interface Trading {
    FullName: string;
    FirstName: string;
    Nickname: string;
    Location: string;
    Description: string;
}
