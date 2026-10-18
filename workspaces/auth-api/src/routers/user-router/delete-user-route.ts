import {SameUserDeleteError} from "@mgtitimoli/auth-domain/same-user-delete-error";
import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import {validate} from "@mgtitimoli/utils/hono/validate";
import type {Hono} from "hono";
import {z} from "zod";

import type {HonoEnv} from "@/hono-env";
import * as userService from "@/services/user-service";
import {sessionCookieSecurity} from "@/utils/session-cookie/session-cookie";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const paramsSchema = z.object({
  userId: z.uuid()
});

const routeDefinition = {
  description:
    "Deletes a user, with their credential and sessions. Users can't delete themselves",
  operationId: "deleteUser",
  responses: {
    204: {description: "User deleted"},
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    401: {content: {"application/json": {schema: failedResponseSchema}}},
    404: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Delete user",
  tags: ["Users"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.delete(
    "/:userId",
    withRouteDefinition.describe(routeDefinition),
    validate("param", paramsSchema),
    async (c): Promise<Response> => {
      const {userId} = c.req.valid("param");

      const database = c.get("database");

      const session = c.get("session");

      try {
        const isDeleted = await userService.deleteUser({
          database,
          session,
          userId
        });

        if (!isDeleted) {
          return c.json({error: "User not found"}, 404);
        }

        return c.body(null, 204);
      } catch (error) {
        if (error instanceof SameUserDeleteError) {
          return c.json({error: error.message}, 409);
        }

        throw error;
      }
    }
  );

export {attachTo};
