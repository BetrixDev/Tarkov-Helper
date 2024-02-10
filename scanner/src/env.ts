import { config } from "dotenv";
import { envsafe, str } from "envsafe";

config();

export const env = envsafe({
  MYSQL_URL: str(),
  MYSQL_PRIVATE_URL: str(),
  API_ENDPOINT: str(),
  NODE_ENV: str(),
});
