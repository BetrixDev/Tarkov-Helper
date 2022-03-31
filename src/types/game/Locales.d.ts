export interface Locales {
    interface: { [key: string]: string }
    enum: any[]
    error: { [key: string]: string }
    mail: { [key: string]: number | string }
    quest: {
        [key: string]: {
            name: string
            description: string
            note: string
            failMessageText: string
            startedMessageText: string
            successMessageText: string
            location: string
            conditions: { [key: string]: string }
        }
    }
    preset: { [key: string]: Preset }
    handbook: { [key: string]: string }
    season: { [key: string]: string }
    customization: { [key: string]: The5_C1B857086F77465F465Faa4 }
    repeatableQuest: { [key: string]: string }
    templates: { [key: string]: Template }
    locations: { [key: string]: MapLocale }
    banners: Banners
    trading: { [key: string]: Trading }
}

interface Banners {
    '5464e0404bdc2d2a708b4567': The5464_E0404Bdc2D2A708B4567
    '5464e0454bdc2d06708b4567': The5464_E0404Bdc2D2A708B4567
    '5807be8924597742c603fa19': The5464_E0404Bdc2D2A708B4567
    '5805f617245977100b2c1f41': The5464_E0404Bdc2D2A708B4567
    '5807bfe124597742a92e0a4c': The5464_E0404Bdc2D2A708B4567
    '5803a58524597710ca36fcb2': The5464_E0404Bdc2D2A708B4567
    '5807c3f124597746bf2db2ce': The5464_E0404Bdc2D2A708B4567
    '5c1b857086f77465f465faa4': The5_C1B857086F77465F465Faa4
}

interface The5464_E0404Bdc2D2A708B4567 {
    name: string
    description: string
}

interface The5_C1B857086F77465F465Faa4 {
    Name: string
    ShortName: string
    Description: string
}

export interface MapLocale {
    Name: string
    Description: string
}

interface Preset {
    Name: null | string
}

interface TartuGecko {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: { [key: string]: string }
    location: string
}

interface The59674Cd986F7744Ab26E32F2 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59674Cd986F7744Ab26E32F2Conditions
    location: string
}

interface The59674Cd986F7744Ab26E32F2Conditions {
    '5cb31b6188a450159d330a18': string
}

interface The596760E186F7741E11214D58 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The596760E186F7741E11214D58Conditions
    location: string
}

interface The596760E186F7741E11214D58Conditions {
    '5968975586f7740e7266d974': string
}

interface The5968Eb3186F7741Dde183A4D {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The5968Eb3186F7741Dde183A4DConditions
    location: string
}

interface The5968Eb3186F7741Dde183A4DConditions {
    '5968eb9b86f7741ddb481543': string
}

interface The596B455186F77457Cb50Eccb {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The596B455186F77457Cb50EccbConditions
    location: string
}

interface The596B455186F77457Cb50EccbConditions {
    '5c9b5e3f86f7744aab7329b5': string
}

interface The59C50A9E86F7745Fef66F4Ff {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C50A9E86F7745Fef66F4FfConditions
    location: string
}

interface The59C50A9E86F7745Fef66F4FfConditions {
    '59674d5186f00443b872d5f7': string
}

interface The59C512Ad86F7741F0D09De9B {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C512Ad86F7741F0D09De9BConditions
    location: string
}

interface The59C512Ad86F7741F0D09De9BConditions {
    '59674d5186f77446b852d5f7': string
}

interface The59C93E8E86F7742A406989C4 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C93E8E86F7742A406989C4Conditions
    location: string
}

interface The59C93E8E86F7742A406989C4Conditions {
    '596a10d886f7741ddf11dbf0': string
}

interface The59F9Da6786F774714230D751 {
    conditions: The59F9Da6786F774714230D751Conditions
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    description: string
    location: string
    name: string
}

interface The59F9Da6786F774714230D751Conditions {}

interface The5A03153686F77442D90E2171 {
    conditions: The5A03153686F77442D90E2171Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A03153686F77442D90E2171Conditions {
    '5c9a17c686f7747dbe2da3c1': string
}

interface The5A27Ba9586F7741B543D8E85 {
    conditions: The5A27Ba9586F7741B543D8E85Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Ba9586F7741B543D8E85Conditions {
    '5a28127b86f7743808504ecc': string
}

interface The5A27Bb8386F7741C770D2D0A {
    conditions: The5A27Bb8386F7741C770D2D0AConditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Bb8386F7741C770D2D0AConditions {
    '5c9de99286f7741ced54c902': string
}

interface The5A27Bc8586F7741B543D8Ea4 {
    conditions: The5A27Bc8586F7741B543D8Ea4Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Bc8586F7741B543D8Ea4Conditions {
    '5a28235e86f7741da250b438': string
}

interface The5A27D2Af86F7744E1115B323 {
    conditions: The5A27D2Af86F7744E1115B323Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27D2Af86F7744E1115B323Conditions {
    '5a27d34586f7744e1115b327': string
}

interface The5A68667486F7742607157D28 {
    conditions: The5A68667486F7742607157D28Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A68667486F7742607157D28Conditions {
    '5a6878e886f7745e65687985': string
}

interface The5_E73519B0B997B5E887E59B3 {
    conditions: { [key: string]: string }
    location: string
    name: string
}

interface The5E748327Dbe23170E05094F4 {
    conditions: The5E748327Dbe23170E05094F4Conditions
    location: string
    name: string
}

interface The5E748327Dbe23170E05094F4Conditions {
    '5e74833f0b1f9954c86ee49c': string
}

interface The5E748D226725D419A47E2101 {
    conditions: The5E748D226725D419A47E2101Conditions
    location: string
    name: string
}

interface The5E748D226725D419A47E2101Conditions {
    '5e748d406725d419a47e2104': string
}

interface The5E748D9Fc73F9622610Abb37 {
    conditions: The5E748D9Fc73F9622610Abb37Conditions
    location: string
    name: string
}

interface The5E748D9Fc73F9622610Abb37Conditions {
    '5e748dc9391f136a9201292e': string
}

interface The5E748Df9C73F9622610Abb38 {
    conditions: The5E748Df9C73F9622610Abb38Conditions
    location: string
    name: string
}

interface The5E748Df9C73F9622610Abb38Conditions {
    '5e748e12c73f9622610abb3b': string
}

interface The5E748E8Fa848081E986A58A2 {
    conditions: The5E748E8Fa848081E986A58A2Conditions
    location: string
    name: string
}

interface The5E748E8Fa848081E986A58A2Conditions {
    '5e7b805f0bc7e118403c847d': string
}

interface The5E74921Dc73F9622610Abb3E {
    conditions: The5E74921Dc73F9622610Abb3EConditions
    location: string
    name: string
}

interface The5E74921Dc73F9622610Abb3EConditions {
    '5e74922b35e14d4fb162de6d': string
}

interface The5E7492C2Cdcce040Bf508424 {
    conditions: The5E7492C2Cdcce040Bf508424Conditions
    location: string
    name: string
}

interface The5E7492C2Cdcce040Bf508424Conditions {
    '5e749308a848081e986a58a6': string
}

interface The5E7493D5C377F60Fe17D6Ec8 {
    conditions: The5E7493D5C377F60Fe17D6Ec8Conditions
    location: string
    name: string
}

interface The5E7493D5C377F60Fe17D6Ec8Conditions {
    '5e7493e9c377f60fe17d6ecb': string
}

interface The5E749741Dec1852497081E69 {
    conditions: The5E749741Dec1852497081E69Conditions
    location: string
    name: string
}

interface The5E749741Dec1852497081E69Conditions {
    '5e74a5f2647a0846684a1dc4': string
}

interface The5E7498198F3A2F53Cc477E99 {
    conditions: The5E7498198F3A2F53Cc477E99Conditions
    location: string
    name: string
}

interface The5E7498198F3A2F53Cc477E99Conditions {
    '5e74983470d454700576d1fb': string
}

interface The5E7498Cc2Eb35C76F5087A47 {
    conditions: The5E7498Cc2Eb35C76F5087A47Conditions
    location: string
    name: string
}

interface The5E7498Cc2Eb35C76F5087A47Conditions {
    '5e7498d9c377f60fe17d6ed4': string
}

interface The5E74990C647A0846684A1Db4 {
    conditions: The5E74990C647A0846684A1Db4Conditions
    location: string
    name: string
}

interface The5E74990C647A0846684A1Db4Conditions {
    '5e749921dec1852497081e6d': string
}

interface The5E74A68870D454700576D1Fe {
    conditions: The5E74A68870D454700576D1FeConditions
    location: string
    name: string
}

interface The5E74A68870D454700576D1FeConditions {
    '5e74a6a4d9d3481b8e64369e': string
}

interface The5E74A765C377F60Fe17D6Edb {
    conditions: The5E74A765C377F60Fe17D6EdbConditions
    location: string
    name: string
}

interface The5E74A765C377F60Fe17D6EdbConditions {
    '5e74a798763a4645365a6186': string
}

interface The5E74A9Be70D454700576D1Ff {
    conditions: The5E74A9Be70D454700576D1FfConditions
    location: string
    name: string
}

interface The5E74A9Be70D454700576D1FfConditions {
    '5e7a0c8ee77ff7644b69febe': string
}

interface The5E74Aafac377F60Fe17D6Ede {
    conditions: The5E74Aafac377F60Fe17D6EdeConditions
    location: string
    name: string
}

interface The5E74Aafac377F60Fe17D6EdeConditions {
    '5e7b2993f60dc341415906fb': string
}

interface The5E74Ac3F70D454700576D200 {
    conditions: The5E74Ac3F70D454700576D200Conditions
    location: string
    name: string
}

interface The5E74Ac3F70D454700576D200Conditions {
    '5e74ac57763a4645365a618b': string
}

interface The5E74B1B201E03F5A8D48Aff9 {
    conditions: The5E74B1B201E03F5A8D48Aff9Conditions
    location: string
    name: string
}

interface The5E74B1B201E03F5A8D48Aff9Conditions {
    '5e74b1c4c16d705f775de1db': string
}

interface The5E74Be4C24C2C642Fa612776 {
    conditions: The5E74Be4C24C2C642Fa612776Conditions
    location: string
    name: string
}

interface The5E74Be4C24C2C642Fa612776Conditions {
    '5e7a012228b2fd48f6591c8f': string
}

interface The5E85E1D15549Dd01Fe748B5A {
    conditions: The5E85E1D15549Dd01Fe748B5AConditions
    location: string
    name: string
}

interface The5E85E1D15549Dd01Fe748B5AConditions {
    '5e85e22e5549dda42377fa77': string
}

interface The5E85E2Fa5549Dd01Fe748B5B {
    conditions: The5E85E2Fa5549Dd01Fe748B5BConditions
    location: string
    name: string
}

interface The5E85E2Fa5549Dd01Fe748B5BConditions {
    '5e85e32a5549ddfb4a0cdb3a': string
}

interface The5E85E40D5549Dd10225137B9 {
    conditions: The5E85E40D5549Dd10225137B9Conditions
    location: string
    name: string
}

interface The5E85E40D5549Dd10225137B9Conditions {
    '5e872a5a5549ddc49d49a643': string
}

interface The5E85E5025549Dda42377Fa7B {
    conditions: The5E85E5025549Dda42377Fa7BConditions
    location: string
    name: string
}

interface The5E85E5025549Dda42377Fa7BConditions {
    '5e85e5405549ddb56f1cf0d9': string
}

interface The5E85E77E5549Ddf8E2131C0B {
    conditions: The5E85E77E5549Ddf8E2131C0BConditions
    location: string
    name: string
}

interface The5E85E77E5549Ddf8E2131C0BConditions {
    '5e85e7b45549dd422605cc1d': string
}

interface The5Eaaaa7C93Afa0558F3B5A1C {
    conditions: The5Eaaaa7C93Afa0558F3B5A1CConditions
    name: string
    note: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    description: string
    location: string
}

interface The5Eaaaa7C93Afa0558F3B5A1CConditions {
    '5eaaaa7c93afa0558f3b5a1f': string
}

interface The5F70Abfae9F14826Bf7C1C65 {
    conditions: The5F70Abfae9F14826Bf7C1C65Conditions
    location: string
    name: string
}

interface The5F70Abfae9F14826Bf7C1C65Conditions {
    '5f970525cfe8173d12189403': string
}

interface The5F70B9Cfe9F14826Bf7C1C67 {
    conditions: The5F70B9Cfe9F14826Bf7C1C67Conditions
    location: string
    name: string
}

interface The5F70B9Cfe9F14826Bf7C1C67Conditions {
    '5f71d67f413b7a71bb3d4883': string
}

interface The5F70E2A5Dcfde927745Eb1D0 {
    conditions: The5F70E2A5Dcfde927745Eb1D0Conditions
    location: string
    name: string
}

interface The5F70E2A5Dcfde927745Eb1D0Conditions {
    '5f8d63247b5bb8669b67ed4a': string
}

interface The5F75C5078Fb5C37Ce1766E95 {
    conditions: The5F75C5078Fb5C37Ce1766E95Conditions
    location: string
    name: string
}

interface The5F75C5078Fb5C37Ce1766E95Conditions {
    '5f9701bc261b2c7e0322947b': string
}

interface The5F75C578Dfacb47E146A0062 {
    conditions: The5F75C578Dfacb47E146A0062Conditions
    location: string
    name: string
}

interface The5F75C578Dfacb47E146A0062Conditions {
    '5f75c578dfacb47e146a0063': string
}

interface The5F75Fd4450914C5Fcc425279 {
    conditions: The5F75Fd4450914C5Fcc425279Conditions
    location: string
    name: string
}

interface The5F75Fd4450914C5Fcc425279Conditions {
    '5f75fd4450914c5fcc42527a': string
}

interface The5F75Fddbd24E8B7A9C508F3A {
    conditions: The5F75Fddbd24E8B7A9C508F3AConditions
    location: string
    name: string
}

interface The5F75Fddbd24E8B7A9C508F3AConditions {
    '5f8f1423d613404c430b7895': string
}

interface The6179Acbdc760Af5Ad2053585 {
    conditions: The6179Acbdc760Af5Ad2053585Conditions
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    location: string
}

interface The6179Acbdc760Af5Ad2053585Conditions {
    '617bd94c5a52d2390a2630c7': string
}

interface The6179Ad0A6E9Dd54Ac275E3F2 {
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    conditions: The6179Ad0A6E9Dd54Ac275E3F2Conditions
    location: string
}

interface The6179Ad0A6E9Dd54Ac275E3F2Conditions {
    '617bf1e1d93d977d2452051f': string
}

interface The6179Aff8F57Fb279792C60A1 {
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    conditions: The6179Aff8F57Fb279792C60A1Conditions
    location: string
}

interface The6179Aff8F57Fb279792C60A1Conditions {
    '617bf4e152e86c73d372a95d': string
}

interface The6193850F60B34236Ee0483De {
    conditions: The6193850F60B34236Ee0483DeConditions
    name: string
    note: string
    successMessageText: string
    description: string
    failMessageText: string
    startedMessageText: string
    location: string
}

interface The6193850F60B34236Ee0483DeConditions {
    '6193dabd5f6468204470571f': string
}

interface The61Bb47481908C67D4249A205 {
    name: string
    note: string
    startedMessageText: string
    failMessageText: string
    description: string
    successMessageText: string
    conditions: The61Bb47481908C67D4249A205Conditions
    location: string
}

interface The61Bb47481908C67D4249A205Conditions {
    '61bc887f4dbcdb6107410c97': string
}

interface The61Bb474Dce7374453B45Dfd2 {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb474Dce7374453B45Dfd2Conditions
    location: string
}

interface The61Bb474Dce7374453B45Dfd2Conditions {
    '61bb69e23177025bdd356695': string
}

interface The61Bb474F8B8D2A79D012Cd6E {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb474F8B8D2A79D012Cd6EConditions
    location: string
}

interface The61Bb474F8B8D2A79D012Cd6EConditions {
    '61bb6c0c6b70332c062ca7bb': string
}

interface The61Bb47516B70332C062Ca7B9 {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb47516B70332C062Ca7B9Conditions
    location: string
}

interface The61Bb47516B70332C062Ca7B9Conditions {
    '61bb6d65d511a47f501702f0': string
}

interface The61E6E60223374D168A4576A6 {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61E6E60223374D168A4576A6Conditions
    location: string
}

interface The61E6E60223374D168A4576A6Conditions {
    '61e6ed30d007ca50d54baae5': string
}

interface The61E6E60C5Ca3B3783662Be27 {
    conditions: The61E6E60C5Ca3B3783662Be27Conditions
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    location: string
}

interface The61E6E60C5Ca3B3783662Be27Conditions {
    '61e6f5a1eea2935bc018a2c7': string
}

interface The61E6E621Bfeab00251576265 {
    conditions: The61E6E621Bfeab00251576265Conditions
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    location: string
}

interface The61E6E621Bfeab00251576265Conditions {
    '61e704a123374d168a4576a8': string
}

interface Template {
    Name: string
    ShortName: number | string
    Description: string
    casingName?: string
    RigLayoutName?: string
    FoldedSlot?: string
}

export interface Trading {
    FullName: string
    FirstName: string
    Nickname: string
    Location: string
    Description: string
}
