import type {HttpBindings} from "@hono/node-server";
import type {Session} from "@mgtitimoli/auth-domain/domain-schema";
import type {
  LoggerMiddlewareEnv,
  SessionMiddlewareEnv
} from "@mgtitimoli/utils/hono/middlewares";
import type {RequestIdVariables} from "hono/request-id";

import type {Database} from "@/database/database";

// prettier-ignore
type HonoEnv =
  & LoggerMiddlewareEnv
  & SessionMiddlewareEnv<Session>
  & {
      Bindings: HttpBindings;
      Variables: RequestIdVariables & {
        database: Database;
      };
    };

export type {HonoEnv};
