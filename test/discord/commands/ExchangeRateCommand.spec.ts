import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../../src/services/TarkovDataService";
import { ExchangeRateCommand } from "../../../src/discord/commands/ExchangeRateCommand";

describe("Exchange rate command tests", () => {
    beforeAll(() => {
        container.resolve(TarkovDataService).initTestData();
    });

    it("should convert rub", () => {
        expect(new ExchangeRateCommand().command("rub", 10000, "en")).toBeDefined();
        expect(new ExchangeRateCommand().command("rub", 10000, "es")).toBeDefined();
    });

    it("should convert usd", () => {
        expect(new ExchangeRateCommand().command("usd", 10000, "en")).toBeDefined();
    });

    it("should convert eur", () => {
        expect(new ExchangeRateCommand().command("eur", 10000, "en")).toBeDefined();
    });
});
