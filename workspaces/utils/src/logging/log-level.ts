import {z} from "zod";

type LogLevel = (typeof logLevels)[keyof typeof logLevels];

const logLevels = {
  debug: "debug",
  error: "error",
  fatal: "fatal",
  info: "info",
  silent: "silent",
  trace: "trace",
  warn: "warn"
} as const;

const logLevelSchema = z.enum(Object.values(logLevels));

export {logLevelSchema, logLevels};
export type {LogLevel};
