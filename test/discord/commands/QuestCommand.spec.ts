import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { QuestCommand } from "../../../src/discord/commands/QuestCommand";

describe("Quest command tests", () => {
    const dataService = container.resolve(TarkovDataService);

    beforeAll(() => {
        dataService.initTestData();
    });

    it("should respond with a message for every quest", () => {
        dataService.fetchData("tasks").forEach((q) => {
            if (!q.tarkovDataId) return;
            expect(new QuestCommand(dataService).command(q.tarkovDataId, "en")).toBeDefined();
        });
    });
});
