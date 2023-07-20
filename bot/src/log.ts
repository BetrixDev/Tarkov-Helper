import { Logger } from "logger";

export const logger = new Logger({
  service: "bot",
  env: process.env,
});
