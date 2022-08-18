import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { BitcoinFarmCommand } from "../../../src/discord/commands/BitcoinFarmCommand";

describe("Bitcoin farm command tests", () => {
    beforeAll(() => {
        container.resolve(TarkovDataService).initTestData();
    });

    it("should respond when not comparing", () => {
        expect(container.resolve(BitcoinFarmCommand).command("en", 10)).toBeDefined();
    });

    it("should respond when comparing", () => {
        expect(container.resolve(BitcoinFarmCommand).command("en", 10, 15)).toBeDefined();
    });
});
