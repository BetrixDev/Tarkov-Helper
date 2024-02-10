import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app";
import { logger } from "./log";
import { renderTrpcPanel } from "trpc-panel";
import { env } from "./env";

const app = express();

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

if (env.NODE_ENV === "dev") {
  app.use("/panel", (_, res) => {
    return res.send(
      renderTrpcPanel(appRouter, { url: "http://localhost:5000/trpc" })
    );
  });
}

app.listen(5000, () => {
  logger.info("Scanner initialized on port 5000");

  if (env.NODE_ENV === "dev") {
    logger.info("http://localhost:5000/panel");
  }
});
