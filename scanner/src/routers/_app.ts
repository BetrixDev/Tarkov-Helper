import { router } from "../trpc";
import { scannerRouter } from "./scanner";

export const appRouter = router({
  scanner: scannerRouter,
});

export type AppRouter = typeof appRouter;
