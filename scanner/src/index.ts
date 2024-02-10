import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app.js";
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
    renderTrpcPanel(appRouter, { url: "http://localhost:5000/trpc" })
  );
});

app.listen(5000, () => {
  logger.info("Scanner initialized on port 5000");
  logger.info("Scanner panel: http://localhost:5000/panel");
});
