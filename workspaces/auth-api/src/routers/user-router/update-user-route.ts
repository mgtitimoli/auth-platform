import {
  updateUserInputSchema,
  userSchema
} from "@mgtitimoli/auth-domain/domain-schema";
import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
import {InactiveUserNameUpdateError} from "@mgtitimoli/auth-domain/inactive-user-name-update-error";
import {SameUserDeactivateError} from "@mgtitimoli/auth-domain/same-user-deactivate-error";
import {
  createSucceededResponseSchema,
  failedResponseSchema
} from "@mgtitimoli/utils/hono/response";
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

const updateUserSucceededResponseSchema = createSucceededResponseSchema(
  userSchema,
  "UpdateUserSucceededResponse"
);

const routeDefinition = {
  description:
    "Updates the given fields of a user. The names of an inactive user can't be updated, and deactivating a user terminates their sessions",
  operationId: "updateUser",
  requestBody: {
    content: {"application/json": {schema: updateUserInputSchema}},
    required: true
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: updateUserSucceededResponseSchema
        }
      }
    },
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    401: {content: {"application/json": {schema: failedResponseSchema}}},
    404: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}},
    422: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Update user",
  tags: ["Users"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.patch(
    "/:userId",
    withRouteDefinition.describe(routeDefinition),
    validate("param", paramsSchema),
    validate("json", updateUserInputSchema),
    async (c): Promise<Response> => {
      const {userId} = c.req.valid("param");

      const input = c.req.valid("json");

      const database = c.get("database");

      const session = c.get("session");

      try {
        const user = await userService.updateUser({
          database,
          input,
          session,
          userId
        });

        if (!user) {
          return c.json({error: "User not found"}, 404);
        }

        return c.json({data: user}, 200);
      } catch (error) {
        if (
          error instanceof DuplicateEmailError ||
          error instanceof SameUserDeactivateError
        ) {
          return c.json({error: error.message}, 409);
        }

        if (error instanceof InactiveUserNameUpdateError) {
          return c.json({error: error.message}, 422);
        }

        throw error;
      }
    }
  );

export {attachTo, updateUserSucceededResponseSchema};
