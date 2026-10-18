import {describeRoute} from "hono-openapi";
import type {DescribeRouteOptions} from "hono-openapi";

import * as withRequestBodyDefinition from "./request-body-definition";
import type {AnyRequestBodyDefinition} from "./request-body-definition";
import * as withResponseDefinition from "./response-definition";
import type {AnyResponseDefinitionRecord} from "./response-definition";

type RouteDefinition<
  TResponseDefinitionRecord extends AnyResponseDefinitionRecord
> = Omit<DescribeRouteOptions, "requestBody" | "responses"> & {
  requestBody?: AnyRequestBodyDefinition;
  responses: TResponseDefinitionRecord;
};

type AnyRouteDefinition = RouteDefinition<AnyResponseDefinitionRecord>;

const toDescribeRouteOptions = ({
  requestBody,
  responses,
  ...rest
}: AnyRouteDefinition): DescribeRouteOptions => ({
  ...rest,
  responses: withResponseDefinition.allToDescribeRouteResponses(responses),
  ...(requestBody && {
    requestBody:
      withRequestBodyDefinition.toDescribeRouteRequestBody(requestBody)
  })
});

const describe = (routeDefinition: AnyRouteDefinition) =>
  describeRoute(toDescribeRouteOptions(routeDefinition));

export {describe};
export type {AnyRouteDefinition, RouteDefinition};
