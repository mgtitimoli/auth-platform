import {
  createUserInputSchema,
  userSchema
} from "@mgtitimoli/auth-domain/domain-schema";
import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
import {
  createSucceededResponseSchema,
  failedResponseSchema
} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import {validate} from "@mgtitimoli/utils/hono/validate";
import type {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";
import * as userService from "@/services/user-service";
import {sessionCookieSecurity} from "@/utils/session-cookie/session-cookie";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const createUserSucceededResponseSchema = createSucceededResponseSchema(
  userSchema,
  "CreateUserSucceededResponse"
);

const routeDefinition = {
  description: "Creates a user with the given password",
  operationId: "createUser",
  requestBody: {
    content: {"application/json": {schema: createUserInputSchema}},
    required: true
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createUserSucceededResponseSchema
        }
      }
    },
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    401: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Create user",
  tags: ["Users"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/",
    withRouteDefinition.describe(routeDefinition),
    validate("json", createUserInputSchema),
    async (c): Promise<Response> => {
      const input = c.req.valid("json");

      const database = c.get("database");

      try {
        const user = await userService.createUser({database, input});

        return c.json({data: user}, 201);
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          return c.json({error: error.message}, 409);
        }

        throw error;
      }
    }
  );

export {attachTo, createUserSucceededResponseSchema};
