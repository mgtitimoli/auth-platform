import pino from "pino";

import type {LogLevel} from "@/logging/log-level";

type Params = {
  logLevel: LogLevel;
};

const createJsonLogger = ({logLevel}: Params) =>
  pino({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime
  });

export {createJsonLogger};
