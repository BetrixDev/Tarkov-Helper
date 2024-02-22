import { router } from "../trpc.js";
import { cryptoRouter } from "./crypto.js";
import { scannerRouter } from "./scanner.js";

export const appRouter = router({
  scanner: scannerRouter,
  crypto: cryptoRouter,
});

export type AppRouter = typeof appRouter;
