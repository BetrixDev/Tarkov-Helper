import { fetchData } from "../src/cache.js";
import { existsSync, mkdirSync, rmSync, rmdirSync, writeFileSync } from "fs";

async function main() {
  if (existsSync(".dev")) {
    rmSync(".dev", { recursive: true });
  }

  mkdirSync(".dev");

  const data = await fetchData();

  Object.entries(data).forEach(([key, value]) => {
    writeFileSync(`.dev/${key}.json`, JSON.stringify(value, null, 2));
  });
}

void main();
