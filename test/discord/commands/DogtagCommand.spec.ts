import "reflect-metadata";
import { container } from "tsyringe";
import { DogtagCommand } from "../../../src/discord/commands/DogtagCommand";
import { TarkovDataService } from "../../../src/services/TarkovDataService";

describe("Dog tag command tests", () => {
    const dataService = container.resolve(TarkovDataService);

    beforeAll(() => {
        dataService.initTestData();
    });

    it("should respond when called", () => {
        expect(new DogtagCommand(dataService).command(10, "en")).toBeDefined();
    });

    it("should error when given a level higher than possible", () => {
        expect(() => {
            new DogtagCommand(dataService).command(100, "en");
        }).toThrow("Please enter a valid level between 1 and 79");
    });

    it("should error when given a negative level", () => {
        expect(() => {
            new DogtagCommand(dataService).command(-100, "en");
        }).toThrow("Please enter a valid level between 1 and 79");
    });
});
