import "reflect-metadata";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { container } from "tsyringe";
import { TarkovDataService } from "../services/TarkovDataService";

async function main() {
    if (existsSync("./runtime_data/")) {
        rmSync("./runtime_data/", { recursive: true, force: true });
    }

    mkdirSync("./runtime_data/");

    const dataService = container.resolve(TarkovDataService);
    const data = await dataService.fetchTestData();

    data.forEach((e) => {
        writeFileSync(`./runtime_data/${e.name.replaceAll("/", "_")}.json`, JSON.stringify(e.data, null, 4));
    });
}

main();
