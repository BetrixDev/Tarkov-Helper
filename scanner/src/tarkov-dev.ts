import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-env.d.ts";
import { Client, cacheExchange, fetchExchange } from "urql";

export const gql = initGraphQLTada<{
  introspection: introspection;
}>();

const urql = new Client({
  url: "https://api.tarkov.dev",
  exchanges: [cacheExchange, fetchExchange],
});

export async function getItemsWithIconLinks() {
  const query = gql(`
    query ItemsWithIcons {
      items {
        id
        image512pxLink
        types
      }
    }
  `);

  const response = await urql.query(query, {}).toPromise();

  return response.data?.items
    .filter((i) => {
      return !i?.types.includes("preset");
    })
    .map((d) => {
      return {
        id: d?.id!.toString()!,
        iconLink: d?.image512pxLink!,
      };
    })!;
}

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
