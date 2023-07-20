import { Logger } from "logger";

import { config } from "dotenv";
config();

export const logger = new Logger({
  service: "backend",
  env: process.env,
});
