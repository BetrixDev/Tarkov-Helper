import { z } from "zod";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const ENVIROMENT = z.object({
    /** Internal */
    NODE_ENV: z
        .union([z.literal("production"), z.literal("development"), z.literal("testing"), z.string()])
        .default(""),
    /** Client token for logging in your bot */
    BOT_TOKEN: z.string(),
    /** Optional token provided to top.gg to upload your bots stats to their website */
    TOPGG_TOKEN: z.string().optional(),
    /** S3 Configuration */
    S3_ENDPOINT: z.string(),
    /** S3 Configuration */
    S3_KEY: z.string(),
    /** S3 Configuration */
    S3_SECRET: z.string(),
    /** S3 Configuration */
    S3_NAME: z.string()
});

const parsed = ENVIROMENT.safeParse(process.env);

if (!parsed.success) {
    parsed.error.errors.forEach((e) => logger.error("ENV", `${e.message} @ ${e.path} > ${e.code}`));
    throw new Error(`Enviroment variables appear to be malformed`);
}

export const env = parsed.data;
