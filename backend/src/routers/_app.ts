import { router } from "../trpc";
import { bartersRouter } from "./barters";
import { itemsRouter } from "./items";
import { tradersRouter } from "./traders";

export const appRouter = router({
  items: itemsRouter,
  traders: tradersRouter,
  barters: bartersRouter,
});

export type AppRouter = typeof appRouter;
