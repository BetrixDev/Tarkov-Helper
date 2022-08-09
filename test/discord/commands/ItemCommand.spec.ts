import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { ItemCommand } from "../../../src/discord/commands/ItemCommand";

describe("Item command tests", () => {
    const dataService = container.resolve(TarkovDataService);
    const itemCommand = container.resolve(ItemCommand);

    beforeAll(() => {
        dataService.initTestData();
    });

    test("Test item command against every item in the game", () => {
        const data = dataService.fetchData("items-tarkov-dev");

        Object.values(data).forEach((item) => {
            if (item.types.includes("preset")) return;

            const message = itemCommand.command(item.id, "en");

            expect(message.embeds?.length).toEqual(1);
        });
    });

    it("should error with an invalid item id", () => {
        expect(() => {
            itemCommand.command("123456", "en");
        }).toThrow("Input not valid, please use the auto complete function to complete your search");
    });
});
