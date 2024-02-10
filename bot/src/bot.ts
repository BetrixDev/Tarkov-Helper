import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { getInfo } from "discord-hybrid-sharding";

import "./env";

const client = new Client({
  shards:
    process.env.NODE_ENV === "production" ? getInfo().SHARD_LIST : undefined,
  shardCount:
    process.env.NODE_ENV === "production" ? getInfo().TOTAL_SHARDS : undefined,
  intents: [],
  botGuilds:
    process.env.NODE_ENV === "development"
      ? [(client) => client.guilds.cache.map((guild) => guild.id)]
      : [],
});

import "./client-events";

async function main() {
  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

  await client.login(process.env.BOT_TOKEN);
}

void main();
