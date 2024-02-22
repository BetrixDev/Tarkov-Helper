import { router } from "../trpc.js";
import { inventoryScannerRouter } from "./scanner.inventory.js";
import { itemScannerRouter } from "./scanner.item.js";
import { cryptoRouter } from "./crypto.js";

export const scannerRouter = router({
  inventory: inventoryScannerRouter,
  item: itemScannerRouter,
});
