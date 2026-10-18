import {userSchema} from "@mgtitimoli/auth-domain/domain-schema";
import {createPaginationQuerySchema} from "@mgtitimoli/utils/hono/query";
import {
  createPaginatedResponseSchema,
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

const maxLimit = 100;

const defaultLimit = 6;

const querySchema = createPaginationQuerySchema(maxLimit, defaultLimit);

const routeDefinition = {
  description: "Gets a page of users, ordered by creation",
  operationId: "getUsers",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: createPaginatedResponseSchema(
            z.array(userSchema),
            "GetUsersSucceededResponse"
          )
        }
      }
    },
    400: {content: {"application/json": {schema: failedResponseSchema}}},
    401: {content: {"application/json": {schema: failedResponseSchema}}}
  },
  security: sessionCookieSecurity,
  summary: "Get users",
  tags: ["Users"]
} satisfies AnyRouteDefinition;

const attachTo = (router: Hono<HonoEnv>) =>
  router.get(
    "/",
    withRouteDefinition.describe(routeDefinition),
    validate("query", querySchema),
    async (c): Promise<Response> => {
      const {limit, offset} = c.req.valid("query");

      const database = c.get("database");

      const [users, total] = await Promise.all([
        userService.getUsers({database, limit, offset}),
        userService.countUsers({database})
      ]);

      return c.json({data: users, pagination: {limit, offset, total}}, 200);
    }
  );

export {attachTo};
