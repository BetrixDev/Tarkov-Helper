import { tarkovDev } from "../gql/client";
import { procedure, router } from "../trpc";
import { bartersRouter } from "./barters";
import { economyRouter } from "./economy";
import { itemsRouter } from "./items";
import { playerRouter } from "./player";
import { questsRouter } from "./quests";
import { tradersRouter } from "./traders";

export const appRouter = router({
  items: itemsRouter,
  traders: tradersRouter,
  barters: bartersRouter,
  economy: economyRouter,
  player: playerRouter,
  quests: questsRouter,
  serverStatus: procedure.query(async () => {
    return await tarkovDev.serverStatus();
  }),
});

export type AppRouter = typeof appRouter;
