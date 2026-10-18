import {
  sessionSchema,
  signUpInputSchema,
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
import {z} from "zod";

import type {HonoEnv} from "@/hono-env";
import * as authService from "@/services/auth-service";
import * as withSessionCookie from "@/utils/session-cookie/session-cookie";

const signUpOutputSchema = z
  .object({
    session: sessionSchema,
    user: userSchema
  })
  .meta({ref: "SignUpOutput"});

const routeDefinition = {
  description:
    "Creates a user and signs them in: responds with the user and the new session, and sets the session cookie",
  operationId: "signUp",
  requestBody: {
    content: {"application/json": {schema: signUpInputSchema}},
    required: true
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createSucceededResponseSchema(
            signUpOutputSchema,
            "SignUpSucceededResponse"
          )
        }
      }
    },
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    409: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  summary: "Sign up",
  tags: ["Auth"]
} satisfies AnyRouteDefinition;

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const attachTo = (router: Hono<HonoEnv>) =>
  router.post(
    "/sign-up",
    withRouteDefinition.describe(routeDefinition),
    validate("json", signUpInputSchema),
    async (c): Promise<Response> => {
      const input = c.req.valid("json");

      const database = c.get("database");

      try {
        const {session, user} = await authService.signUp({database, input});

        withSessionCookie.set(c, session.id);

        return c.json({data: {session, user}}, 201);
      } catch (error) {
        if (error instanceof DuplicateEmailError) {
          return c.json({error: error.message}, 409);
        }

        throw error;
      }
    }
  );

export {attachTo};
