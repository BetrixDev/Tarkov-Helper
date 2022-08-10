import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { ExperienceCommand } from "../../../src/discord/commands/ExperienceCommand";

describe("Experience command tests", () => {
    const dataService = container.resolve(TarkovDataService);

    beforeAll(() => {
        dataService.initTestData();
    });

    it("should respond when given two levels", () => {
        expect(new ExperienceCommand(dataService).command(1, 5, "en")).toBeDefined();
    });

    it("should respond when given an xp amount", () => {
        expect(new ExperienceCommand(dataService).command(10000, 50, "en")).toBeDefined();
    });
});
