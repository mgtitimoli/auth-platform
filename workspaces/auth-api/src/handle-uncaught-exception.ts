import {logger} from "./logger";

process.on("uncaughtException", error => {
  logger.fatal(
    {error, message: error.message, stack: error.stack},
    "Uncaught exception"
  );

  process.exit(1);
});
