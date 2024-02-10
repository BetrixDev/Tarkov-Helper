import { z } from "zod";
import { get } from "../cache.js";
import { procedure, router } from "../trpc.js";
import { TRPCError } from "@trpc/server";

export const playerRouter = router({
  maxPlayerLevel: procedure.query(() => {
    const maxLevel = get("playerLevels").at(-1)?.level;

    if (maxLevel === undefined) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    return maxLevel;
  }),
  experienceForLevel: procedure
    .input(
      z.object({
        level: z.number(),
      })
    )
    .query(({ input }) => {
      let totalXp = 0;

      for (let l = 0; l < input.level; l++) {
        const levelData = get("playerLevels").at(l);

        if (levelData === undefined) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        totalXp += levelData.exp;
      }

      return totalXp;
    }),
});
