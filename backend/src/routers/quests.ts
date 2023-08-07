import { z } from "zod";
import { procedure, router } from "../trpc";
import { localesSchema } from "common";
import { searchCatagory } from "../search-engines";
import { get } from "../cache";

export const questsRouter = router({
  search: procedure
    .input(
      z.object({
        query: z.string(),
        maxResults: z.number().default(25),
        locale: localesSchema,
      })
    )
    .query(({ input }) => {
      return searchCatagory("quests", input.query, input.locale).slice(
        0,
        input.maxResults - 1
      );
    }),
  tryQuestInput: procedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input }) => {
      return get("tasks").find(
        (q) =>
          q.id === input.query ||
          q.name.toLowerCase() === input.query.toLowerCase()
      )?.id;
    }),
});
