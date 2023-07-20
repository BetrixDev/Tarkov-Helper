import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app";
import { initCache } from "./cache";
import { refreshSearchEngines } from "./search-engines";
import { logger } from "./log";

const app = express();

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

initCache().then(() => {
  refreshSearchEngines();

  app.listen(3000, () => {
    logger.info("Backend listening");
  });
});
