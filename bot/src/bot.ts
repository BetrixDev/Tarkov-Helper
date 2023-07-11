import { Client } from "discordx";
import { importx } from "@discordx/importer";
import { getInfo } from "discord-hybrid-sharding";

import "./env";

const client = new Client({
  // shards: getInfo().SHARD_LIST,
  // shardCount: getInfo().TOTAL_SHARDS,
  intents: [],
  botGuilds:
    process.env.NODE_ENV === "development"
      ? [(client) => client.guilds.cache.map((guild) => guild.id)]
      : [],
});

client.on("ready", async () => {
  console.log("Tarkov Helper started");

  await client.guilds.fetch();
  await client.initApplicationCommands();
});

client.on("interactionCreate", (interaction) => {
  client.executeInteraction(interaction);
});

async function main() {
  await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  await client.login(process.env.BOT_TOKEN);
}

void main();
