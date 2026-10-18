import {userSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {
  createSucceededResponseSchema,
  failedResponseSchema
} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import type {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";
import * as userService from "@/services/user-service";
import {sessionCookieSecurity} from "@/utils/session-cookie/session-cookie";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const routeDefinition = {
  description: "Gets the user of the current session",
  operationId: "getCurrentUser",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: createSucceededResponseSchema(
            userSchema,
            "GetCurrentUserSucceededResponse"
          )
        }
      }
    },
    401: {content: {"application/json": {schema: failedResponseSchema}}},
    404: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Get current user",
  tags: ["Users"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.get(
    "/me",
    withRouteDefinition.describe(routeDefinition),
    async (c): Promise<Response> => {
      const database = c.get("database");

      const session = c.get("session");

      const user = await userService.getUser({database, id: session.userId});

      if (!user) {
        return c.json({error: "User not found"}, 404);
      }

      return c.json({data: user}, 200);
    }
  );

export {attachTo};
