import type {TypedResponse} from "hono";
import type {StatusCode} from "hono/utils/http-status";
import {resolver} from "hono-openapi";
import type {DescribeRouteOptions} from "hono-openapi";
import {z} from "zod";
// TODO: Use standard-schema instead of zod
import type {ZodType} from "zod";

import {getEntries} from "@/object";
import {isDefined} from "@/validation";

import type {DescribeRouteResponse} from "./types";

type AnyResponseContent = Record<string, {schema: ZodType}>;

type ContentlessResponseDefinition = {
  content?: undefined;
  description?: string;
};

type ContentfulResponseDefinition<TContent extends AnyResponseContent> = {
  content: TContent;
  description?: string;
};

type ResponseDefinition<TContent extends AnyResponseContent | undefined> =
  TContent extends AnyResponseContent
    ? ContentfulResponseDefinition<TContent>
    : ContentlessResponseDefinition;

type AnyResponseDefinition = ResponseDefinition<AnyResponseContent | undefined>;

type AnyResponseDefinitionRecord = Partial<
  Record<StatusCode, AnyResponseDefinition>
>;

type TypeResponseFrom<TResponsesRecord extends AnyResponseDefinitionRecord> = {
  [TStatusCode in keyof TResponsesRecord]: TStatusCode extends StatusCode
    ? TResponsesRecord[TStatusCode] extends ContentlessResponseDefinition
      ? TypedResponse<null, TStatusCode, "body">
      : TResponsesRecord[TStatusCode] extends ContentfulResponseDefinition<
            infer TContent
          >
        ? {
            [TContentType in keyof TContent]: TContentType extends string
              ? TypedResponse<
                  z.infer<TContent[TContentType]["schema"]>,
                  TStatusCode,
                  "json"
                >
              : never;
          }[keyof TContent]
        : never
    : never;
}[keyof TResponsesRecord];

const toDescribeRouteResponse = (
  responseDefinition: AnyResponseDefinition
): DescribeRouteResponse => {
  if (!responseDefinition.content) {
    // TODO: Check why we need to cast
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return {
      description: responseDefinition.description
    } as unknown as DescribeRouteResponse;
  }

  // TODO: Check why we need to cast
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return {
    ...responseDefinition,
    content: Object.fromEntries(
      getEntries(responseDefinition.content).map(
        ([contentType, content]) =>
          [contentType, {schema: resolver(content.schema)}] as const
      )
    )
  } as unknown as DescribeRouteResponse;
};

const allToDescribeRouteResponses = (responses: AnyResponseDefinitionRecord) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Object.fromEntries(
    getEntries(responses)
      .filter(isDefined)
      .map(responseEntry => {
        if (responseEntry[1] === undefined) {
          return responseEntry;
        }

        const [statusCode, responseDefinition] = responseEntry;

        return [
          statusCode,
          toDescribeRouteResponse(responseDefinition)
        ] as const;
      })
  ) as unknown as NonNullable<DescribeRouteOptions["responses"]>;

export {allToDescribeRouteResponses, toDescribeRouteResponse};
export type {
  AnyResponseDefinition,
  AnyResponseDefinitionRecord,
  TypeResponseFrom
};
