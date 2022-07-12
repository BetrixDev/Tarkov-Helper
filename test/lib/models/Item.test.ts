import "reflect-metadata";
import { Item } from "../../../src/lib/models/Item";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";

describe("Item Class Tests", () => {
    beforeAll(() => {
        container.resolve(TarkovDataService).initTestData();
    });

    it("should grab data for a black slick", () => {
        const item = new Item("5e4abb5086f77406975c9342", "en");

        expect(item.data.id).toEqual("5e4abb5086f77406975c9342");
    });
});
