import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { BarterCommand } from "../../../src/discord/commands/BarterCommand";

describe("Item command tests", () => {
    const dataService = container.resolve(TarkovDataService);
    const barterCommand = container.resolve(BarterCommand);

    beforeAll(() => {
        dataService.initTestData();
    });

    test("Test item command against every item in the game", () => {
        const data = dataService.fetchData("items-tarkov-dev");

        Object.values(data).forEach((item) => {
            if (item.types.includes("preset")) return;

            const message = barterCommand.command(item.id, "en");

            expect(message.embeds?.length).toEqual(1);
        });
    });

    it("should error with an invalid item id", () => {
        expect(() => {
            barterCommand.command("123456", "en");
        }).toThrow("Input not valid, please use the auto complete function to complete your search");
    });

    it("should return a message when passed with a short name", () => {
        expect(barterCommand.command("M995", "en")).toBeDefined();
    });
});
