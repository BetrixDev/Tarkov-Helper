import { GraphQLClient } from "graphql-request";
import { getSdk } from "./generated";

const client = new GraphQLClient("https://api.tarkov.dev/graphql", {
  errorPolicy: "ignore",
});

export const tarkovDev = getSdk(client);
