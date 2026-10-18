import type {HttpBindings} from "@hono/node-server";
import type {LoggerMiddlewareEnv} from "@mgtitimoli/utils/hono/middlewares";
import type {RequestIdVariables} from "hono/request-id";

import type {Database} from "@/database/database";

// prettier-ignore
type HonoEnv =
  & LoggerMiddlewareEnv
  & {
      Bindings: HttpBindings;
      Variables: RequestIdVariables & {
        database: Database;
      };
    };

export type {HonoEnv};
