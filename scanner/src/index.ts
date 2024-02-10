import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter } from "./routers/_app";
import { logger } from "./log";

const app = express();

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(5000, () => {
  logger.info("Scanner initialized on port 5000");
});
