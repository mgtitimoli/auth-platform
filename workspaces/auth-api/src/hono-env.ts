import type {HttpBindings} from "@hono/node-server";
import type {LoggerMiddlewareEnv} from "@mgtitimoli/utils/hono/middlewares";
import type {RequestIdVariables} from "hono/request-id";

// prettier-ignore
type HonoEnv =
  & LoggerMiddlewareEnv
  & {
      Bindings: HttpBindings;
      Variables: RequestIdVariables;
    };

export type {HonoEnv};
