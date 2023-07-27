import { router } from "../trpc";
import { bartersRouter } from "./barters";
import { economyRouter } from "./economy";
import { itemsRouter } from "./items";
import { tradersRouter } from "./traders";

export const appRouter = router({
  items: itemsRouter,
  traders: tradersRouter,
  barters: bartersRouter,
  economy: economyRouter,
});

export type AppRouter = typeof appRouter;
