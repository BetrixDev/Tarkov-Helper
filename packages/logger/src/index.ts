import winston, {
  createLogger,
  type Logger as WinstonLogger,
  format,
} from "winston";
import chalk from "chalk";
import { WinstonTransport as AxiomTransport } from "@axiomhq/axiom-node";

// https://github.com/ImLunaHey/jive/blob/main/src/logger.ts

const logLevelColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  verbose: "blue",
  debug: "magenta",
} as const;

const colorLevel = (level: keyof typeof logLevelColors) => {
  const color = logLevelColors[level];
  return chalk[color](level);
};

declare const splatSymbol: unique symbol;

type Meta = {
  [splatSymbol]: unknown[];
};

const formatMeta = (meta: Meta) => {
  const splat = meta[Symbol.for("splat") as typeof splatSymbol];
  if (splat && splat.length > 0)
    return splat.length === 1
      ? JSON.stringify(splat[0])
      : JSON.stringify(splat);
  return "";
};

type LoggerOptions = {
  service: string;
  env: Record<string, string | undefined>;
};

export class Logger {
  private logger: WinstonLogger;

  constructor(options: LoggerOptions) {
    this.logger = createLogger({
      level: "silly",
      format: format.combine(format.errors({ stack: true }), format.json()),
      defaultMeta: {
        service: options.service,
      },
      transports: [],
    });

    if (options.env.NODE_ENV === "test") {
      this.logger.silent = true;
    }

    if (options.env.AXIOM_TOKEN && options.env.AXIOM_ORG_ID) {
      this.logger.add(
        new AxiomTransport({
          handleExceptions: true,
          handleRejections: true,
          token: options.env.AXIOM_TOKEN,
          orgId: options.env.AXIOM_ORG_ID,
        })
      );
    }

    if (
      options.env.NODE_ENV !== "test" &&
      this.logger.transports.length === 0
    ) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({ service, level, message, timestamp, ...meta }) => {
                const formattedDate = new Date(
                  timestamp as string
                ).toLocaleTimeString("en");
                const serviceName = (service as string) ?? "app";
                const formattedLevel = colorLevel(
                  level as keyof typeof logLevelColors
                );
                const formattedMeta = formatMeta(meta as Meta);
                return `${formattedDate} [${serviceName}] [${formattedLevel}]: ${
                  message as string
                } ${formattedMeta}`;
              }
            )
          ),
        })
      );
    }
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.logger.debug(message, meta);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.logger.warn(message, meta);
  }

  error(
    message: string,
    meta?: { error: unknown; cause?: unknown } & Record<string, unknown>
  ) {
    // If the error isn't an error object make it so
    // This is to prevent issues where something other than an Error is thrown
    // When passing this to transports like Axiom it really needs to be a real Error class
    if (meta?.error && !(meta?.error instanceof Error))
      meta.error = new Error(`Unknown Error: ${String(meta.error)}`);
    this.logger.error(message, meta);

    // Also log errors to stderr for now
    // This needs to remain until the issue with winston not serialising errors is fixed
    console.log(message, meta);
  }
}
