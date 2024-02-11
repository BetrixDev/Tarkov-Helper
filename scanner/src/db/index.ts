import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../env.js";
import { sql } from "drizzle-orm";

const connection = await mysql.createConnection({
  uri: env.MYSQL_URL,
});

export const db = drizzle(connection);

export async function createHashUdf() {
  return await db.execute(sql`
    CREATE FUNCTION IF NOT EXISTS get_hamming_dist(hash1 VARCHAR(64), hash2 VARCHAR(64))
    RETURNS INT
    BEGIN
        DECLARE i INT DEFAULT 1;
        DECLARE dist INT DEFAULT 0;

        WHILE (i <= 64) DO
            IF SUBSTRING(hash1, i, 1) != SUBSTRING(hash2, i, 1) THEN
                SET dist = dist + 1;
            END IF;

            SET i = i + 1;
        END WHILE;
      RETURN dist;
    END;
  `);
}
