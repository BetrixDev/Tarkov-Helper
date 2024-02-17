import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "backend";
import { fetch } from "undici";

const globalAny = global as any;
globalAny.fetch = fetch;

export const backendTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.API_ENDPOINT!,
    }),
  ],
});
