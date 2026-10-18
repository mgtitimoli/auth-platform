import {signInInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {InactiveUserError} from "@mgtitimoli/auth-domain/inactive-user-error";
import {InvalidCredentialsError} from "@mgtitimoli/auth-domain/invalid-credentials-error";
import {failedResponseSchema} from "@mgtitimoli/utils/hono/response";
import type {TypeResponseFrom} from "@mgtitimoli/utils/hono/response-definition";
import * as withRouteDefinition from "@mgtitimoli/utils/hono/route-definition";
import type {AnyRouteDefinition} from "@mgtitimoli/utils/hono/route-definition";
import {validate} from "@mgtitimoli/utils/hono/validate";
import type {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";
import * as authService from "@/services/auth-service";
import * as withSessionCookie from "@/utils/session-cookie/session-cookie";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const routeDefinition = {
  description: "Signs a user in, setting the session cookie",
  operationId: "signIn",
  requestBody: {
    content: {"application/json": {schema: signInInputSchema}},
    required: true
  },
  responses: {
    204: {description: "Signed in: the session id is in the session cookie"},
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    401: {content: {"application/json": {schema: failedResponseSchema}}},
    403: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  summary: "Sign in",
  tags: ["Auth"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/sign-in",
    withRouteDefinition.describe(routeDefinition),
    validate("json", signInInputSchema),
    async (c): Promise<Response> => {
      const input = c.req.valid("json");

      const database = c.get("database");

      try {
        const session = await authService.signIn({database, input});

        withSessionCookie.set(c, session.id);

        return c.body(null, 204);
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return c.json({error: error.message}, 401);
        }

        if (error instanceof InactiveUserError) {
          return c.json({error: error.message}, 403);
        }

        throw error;
      }
    }
  );

export {attachTo};
