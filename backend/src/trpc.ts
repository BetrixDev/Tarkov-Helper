import { initTRPC } from "@trpc/server";

export const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;

export type { AppRouter } from "./routers/_app.js";
