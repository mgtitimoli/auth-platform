import {resolver} from "hono-openapi";
import type {DescribeRouteOptions} from "hono-openapi";
// TODO: Use standard-schema instead of zod
import type {ZodType} from "zod";

import {getEntries} from "@/object";

type RequestBodyContent = Record<string, {schema: ZodType}>;

type RequestBodyDefinition<TContent extends RequestBodyContent> = {
  content: TContent;
  description?: string;
  required?: boolean;
};

type AnyRequestBodyDefinition = RequestBodyDefinition<RequestBodyContent>;

const toDescribeRouteRequestBody = (
  requestBodyDefinition: AnyRequestBodyDefinition
) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  ({
    ...requestBodyDefinition,
    content: Object.fromEntries(
      getEntries(requestBodyDefinition.content).map(
        ([contentType, content]) =>
          [contentType, {schema: resolver(content.schema)}] as const
      )
    )
  }) as unknown as NonNullable<DescribeRouteOptions["requestBody"]>;

export {toDescribeRouteRequestBody};
export type {AnyRequestBodyDefinition, RequestBodyDefinition};
