import type { Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  driver: "mysql2",
  schema: "./src/db/tables/*",
  dbCredentials: {
    uri: env.MYSQL_URL,
  },
} satisfies Config;
