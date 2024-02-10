import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app.js";
import { initCache } from "./cache.js";
import { refreshSearchEngines } from "./search-engines.js";
import { logger } from "./log.js";

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

  app.listen(8080, () => {
    logger.info("Backend listening");
  });
});
