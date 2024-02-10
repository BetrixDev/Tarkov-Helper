import { config } from "dotenv";
import { envsafe, str } from "envsafe";

config();

export const env = envsafe({
  VISION_CREDS: str(),
});
