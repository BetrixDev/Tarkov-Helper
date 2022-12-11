import "reflect-metadata";
import { container } from "tsyringe";
import { MapCommand } from "../../../src/discord/commands/MapCommand";
import { TarkovDataService } from "../../../src/services/TarkovDataService";

describe("Map command tests", () => {
    const dataService = container.resolve(TarkovDataService);

    beforeAll(() => {
        dataService.initTestData();
    });

    it("should respond for every map", () => {
        const command = container.resolve(MapCommand);

        dataService.fetchData("maps").forEach((map) => {
            expect(command.command(map.id, "en")).toBeDefined();
        });
    });
});
