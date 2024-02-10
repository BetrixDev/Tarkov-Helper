import { ClusterManager } from "discord-hybrid-sharding";

import "./env";
import { logger } from "./log.js";

const manager = new ClusterManager(`${__dirname}/bot.js`, {
  mode: "process",
  token: process.env.BOT_TOKEN,
});

manager.on("clusterCreate", (cluster) => {
  logger.info(`Launched new cluster`, {
    id: cluster.id,
    totalShards: cluster.totalShards,
  });
});

manager.spawn();
