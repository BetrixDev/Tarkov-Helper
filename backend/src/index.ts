import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app.js";
import { initCache } from "./cache.js";
import { refreshSearchEngines } from "./search-engines.js";
import { logger } from "./log.js";
import { renderTrpcPanel } from "trpc-panel";

const app = express();

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.use("/panel", (_, res) => {
  return res.send(
    renderTrpcPanel(appRouter, { url: "http://localhost:8080/trpc" })
  );
});

initCache().then(() => {
  refreshSearchEngines();

  app.listen(8080, () => {
    logger.info("Backend listening");
    logger.info("Backend panel: http://localhost:8080/panel");
  });
});
