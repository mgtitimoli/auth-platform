import "./handle-uncaught-exception";

import {serve} from "@hono/node-server";
import * as withServer from "@mgtitimoli/utils/hono/server";

import {logger} from "./logger";
import {router} from "./router";
import {environmentVariables} from "./utils/environment/environment-variables";

const server = serve(
  {fetch: router.fetch, port: environmentVariables.AUTH_API_PORT},
  info => {
    logger.info({port: info.port}, "Server started on port: " + info.port);
  }
);

withServer.closeOnSignals({
  onClosed: () => logger.info("Server closed successfully"),

  onClosing: signal =>
    logger.info(signal + " received, closing server gracefully"),

  onError: (signal, error) =>
    logger.error({error}, "Error closing server on " + signal),

  server
});
