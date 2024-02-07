import { ScannedInventory } from "./models/ScannedInventory";
import { readFileSync } from "fs";

async function main() {
  const scannedInventory = new ScannedInventory(readFileSync("test.png"));
  scannedInventory.extractCells();
}

main();
