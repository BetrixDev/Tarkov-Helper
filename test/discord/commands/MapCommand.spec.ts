import "reflect-metadata";
import { MAP_METADATA } from "../../../src/lib/models/Location";
import { container } from "tsyringe";
import { MapCommand } from "../../../src/discord/commands/MapCommand";
import { TarkovDataService } from "../../../src/services/TarkovDataService";

describe("Map command tests", () => {
    beforeAll(() => {
        container.resolve(TarkovDataService).initTestData();
    });

    it("should respond for every map", () => {
        const command = container.resolve(MapCommand);

        MAP_METADATA.forEach((map) => {
            expect(command.command(map.id, "en")).toBeDefined();
        });
    });
});
