import { translation } from "../../../src/lib/util/translation";

describe("Translation", function () {
    it("should translate a sentence", () => {
        const tEn = translation("en");
        const tEs = translation("es");

        // Test for missing key
        expect(tEn("Hello")).toEqual("Hello");
        expect(tEs("Hello")).toEqual("Hello");

        expect(tEn("{0} isn't needed for any quests", "Quest")).toEqual("Quest isn't needed for any quests");
        expect(tEs("{0} isn't needed for any quests", "Quest")).toEqual("Quest No es necesario para ninguna misión");
    });
});
