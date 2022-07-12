import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { RestocksCommand } from "../../../src/discord/commands/RestocksCommand";

describe("Restocks Command", () => {
    beforeAll(() => {
        container.resolve(TarkovDataService).initTestData();
    });

    it("should respond with trader restock information", () => {
        const restocksCommand = container.resolve(RestocksCommand);

        expect(restocksCommand.command("en")).toBeDefined();
        expect(restocksCommand.command("es")).toBeDefined();
    });
});
