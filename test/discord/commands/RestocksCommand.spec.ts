import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { RestocksCommand } from "../../../src/discord/commands/RestocksCommand";

describe("Restocks command tests", () => {
    const dataService = container.resolve(TarkovDataService);

    beforeAll(() => {
        dataService.initTestData();
    });

    it("should respond with a message", () => {
        expect(new RestocksCommand(dataService).command("en")).toBeDefined();
    });
});
