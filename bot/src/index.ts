import { ClusterManager } from "discord-hybrid-sharding";

import "./env";

const manager = new ClusterManager(`${__dirname}/bot.js`, {
  mode: "process",
  token: process.env.BOT_TOKEN,
});
