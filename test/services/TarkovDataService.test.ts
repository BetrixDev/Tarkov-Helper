import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../src/services/TarkovDataService";

describe("Tarkov Data Service Tests", function () {
    const service = container.resolve(TarkovDataService);

    beforeAll(() => {
        service.initTestData();
    });

    it("should query tarkov.dev for item data", async () => {
        const data = service.fetchData("items-tarkov-dev");

        expect(data["5e4abb5086f77406975c9342"].id).toEqual("5e4abb5086f77406975c9342");
    });

    it("should query tarkov changes", () => {
        const data = service.fetchData("items-tarkov-changes");

        expect(typeof data["5e4abb5086f77406975c9342"]).toEqual("object");
    });
});
