import type {ValidationTargets} from "hono";
import type {DescribeRouteOptions} from "hono-openapi";

import type {HttpMethod} from "@/http/http-method";

type ValidationTargetName = keyof ValidationTargets;

type DescribeRouteResponse = Pick<
  NonNullable<DescribeRouteOptions["responses"]>,
  string
>;

type RouteDescriptor = {
  method: HttpMethod;
  path: string;
};

export type {DescribeRouteResponse, RouteDescriptor, ValidationTargetName};
