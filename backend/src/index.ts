import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./routers/_app";
import express from "express";
import { initCache } from "./cache";
import { refreshSearchEngines } from "./search-engines";

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
    console.log("backend listening");
  });
});
