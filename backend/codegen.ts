import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.tarkov.dev/graphql",
  documents: "src/gql/queries.ts",
  generates: {
    "src/gql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        avoidOptionals: true,
        enumsAsTypes: true,
        immutableTypes: true,
        maybeValue: "T",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
