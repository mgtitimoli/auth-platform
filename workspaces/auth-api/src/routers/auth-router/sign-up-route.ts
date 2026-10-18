import {signUpInputSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {DuplicateEmailError} from "@mgtitimoli/auth-domain/duplicate-email-error";
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
  description: "Creates a user and signs them in, setting the session cookie",
  operationId: "signUp",
  requestBody: {
    content: {"application/json": {schema: signUpInputSchema}},
    required: true
  },
  responses: {
    201: {
      description:
        "User created and signed in: the session id is in the session cookie"
    },
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  summary: "Sign up",
  tags: ["Auth"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/sign-up",
    withRouteDefinition.describe(routeDefinition),
    validate("json", signUpInputSchema),
    async (c): Promise<Response> => {
      const input = c.req.valid("json");

      const database = c.get("database");

      try {
        const session = await authService.signUp({database, input});

        withSessionCookie.set(c, session.id);

        return c.body(null, 201);
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          return c.json({error: error.message}, 409);
        }

        throw error;
      }
    }
  );

export {attachTo};
