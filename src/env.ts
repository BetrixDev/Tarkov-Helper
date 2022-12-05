import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const ENVIROMENT = z.object({
    /** Internal */
    NODE_ENV: z.union([z.literal("production"), z.literal("development"), z.literal("testing")]),
    /** Client token for logging in your bot */
    BOT_TOKEN: z.string(),
    /** tarkov-changes.com token for grabbing up-to-date item properties */
    TARKOV_CHANGES_TOKEN: z.string(),
    /** Optional token provided to top.gg to upload your bots stats to their website */
    TOPGG_TOKEN: z.string().optional(),
    /** Provided */
    DATABASE_URL: z.string().url()
});

const parsed = ENVIROMENT.safeParse(process.env);

if (!parsed.success) {
    throw new Error(`Enviroment variables appear to be malformed, ${parsed.error.errors.join("\n")}`);
}

export const env = parsed.data;
