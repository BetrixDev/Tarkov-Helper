import z from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
  NODE_ENV: z.string(),
  BOT_TOKEN: z.string(),
  API_ENDPOINT: z.string().url(),
});

envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
