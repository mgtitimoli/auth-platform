import pino from "pino";

import type {LogLevel} from "@/logging/log-level";

type Params = {
  logFilePath?: string;
  logLevel: LogLevel;
  retainLogs?: boolean;
};

const getFileTransport = (
  logFilePath: string,
  logLevel: LogLevel,
  retainLogs: boolean
) => ({
  level: logLevel,
  options: {
    append: retainLogs,
    destination: logFilePath,
    mkdir: true
  },
  target: "pino/file"
});

const getDebugTransport = (logLevel: LogLevel) => ({
  level: logLevel,
  target: "hono-pino/debug-log"
});

const createDebugHonoLogger = ({
  logFilePath,
  logLevel,
  retainLogs = false
}: Params) =>
  pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      targets: [
        getDebugTransport(logLevel),
        ...(logFilePath
          ? [getFileTransport(logFilePath, logLevel, retainLogs)]
          : [])
      ]
    }
  });

export {createDebugHonoLogger};
