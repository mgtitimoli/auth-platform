import type {Env, Hono} from "hono";

import type {TypeResponseFrom} from "@/hono/response-definition";
import * as withRouteDefinition from "@/hono/route-definition";
import type {AnyRouteDefinition} from "@/hono/route-definition";

import type {RouteDescriptor} from "./types";

type Response = TypeResponseFrom<(typeof routeDefinition)["responses"]>;

const routeDescriptor: RouteDescriptor = {
  method: "GET",
  path: "/health"
};

const routeDefinition = {
  description: "Health check",
  operationId: "health",
  responses: {
    204: {}
  },
  summary: "Health check",
  tags: ["Health"]
} satisfies AnyRouteDefinition;

const attachTo = <TEnv extends Env>(router: Hono<TEnv>) =>
  router.get(
    routeDescriptor.path,
    withRouteDefinition.describe(routeDefinition),
    (c): Response => c.body(null, 204)
  );

export {attachTo, routeDescriptor};
