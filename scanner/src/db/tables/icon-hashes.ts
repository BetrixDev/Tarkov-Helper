import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const iconHashesTable = mysqlTable("icon_hashes", {
  itemId: varchar("item_id", { length: 24 }).primaryKey(),
  hash: varchar("hash", { length: 64 }).notNull(),
});
