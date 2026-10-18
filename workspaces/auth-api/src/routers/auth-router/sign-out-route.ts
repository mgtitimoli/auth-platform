import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import type {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";
import * as sessionService from "@/services/session-service";
import * as withSessionCookie from "@/utils/session-cookie/session-cookie";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const {sessionCookieSecurity} = withSessionCookie;

const routeDefinition = {
  description: "Terminates the current session and removes the session cookie",
  operationId: "signOut",
  responses: {
    204: {description: "Signed out"},
    401: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Sign out",
  tags: ["Auth"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/sign-out",
    withRouteDefinition.describe(routeDefinition),
    async (c): Promise<Response> => {
      const database = c.get("database");

      const session = c.get("session");

      await sessionService.terminateSession({database, id: session.id});

      withSessionCookie.remove(c);

      return c.body(null, 204);
    }
  );

export {attachTo};
