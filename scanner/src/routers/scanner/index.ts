import { router } from "../../trpc.js";
import { inventoryScannerRouter } from "./inventory.js";
import { itemScannerRouter } from "./item.js";

export const scannerRouter = router({
  inventory: inventoryScannerRouter,
  item: itemScannerRouter,
});
