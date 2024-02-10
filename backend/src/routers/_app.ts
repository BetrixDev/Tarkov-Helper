import { tarkovDev } from "../gql/client.js";
import { procedure, router } from "../trpc.js";
import { bartersRouter } from "./barters.js";
import { economyRouter } from "./economy.js";
import { itemsRouter } from "./items.js";
import { playerRouter } from "./player.js";
import { questsRouter } from "./quests.js";
import { tradersRouter } from "./traders.js";

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
