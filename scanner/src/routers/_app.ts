import { router } from "../trpc.js";
import { scannerRouter } from "./scanner.js";

export const appRouter = router({
  scanner: scannerRouter,
});

export type AppRouter = typeof appRouter;
