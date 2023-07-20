import { z } from "zod";

export const localesSchema = z
  .union([z.literal("en"), z.literal("es"), z.literal("ru"), z.literal("ge")])
  .default("en");

export const SUPPORTED_LOCALES = ["en", "es", "ru", "ge"] as const;

export type SupportedLocale = z.infer<typeof localesSchema>;
