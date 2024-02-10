import { mysqlTable, varchar, binary } from "drizzle-orm/mysql-core";

export const iconHashesTable = mysqlTable("icon-hashes", {
  itemId: varchar("item_id", { length: 24 }).primaryKey(),
  hash: binary("hash", { length: 64 }).notNull(),
});
