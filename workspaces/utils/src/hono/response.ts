import z from "zod";
import type {ZodType} from "zod";

import * as withHttpStatusCode from "@/http/http-status-code";
import type {HttpStatusCode} from "@/http/http-status-code";

type FailedResponse = z.infer<typeof failedResponseSchema>;

const failedResponseSchema = z
  .object({
    error: z.string()
  })
  .meta({ref: "FailedResponse"});

const createSucceededResponseSchema = <TZodType extends ZodType>(
  schema: TZodType,
  ref: string
) =>
  z
    .object({
      data: schema
    })
    .meta({
      ref
    });

const responsePaginationSchema = z
  .object({
    limit: z.number(),
    offset: z.number(),
    total: z.number()
  })
  .meta({
    ref: "ResponsePagination"
  });

const createPaginatedResponseSchema = <TZodType extends ZodType>(
  schema: TZodType,
  ref: string
) =>
  z
    .object({
      data: schema,
      pagination: responsePaginationSchema
    })
    .meta({
      ref
    });

const getErrorFrom = async (response: Response): Promise<string | undefined> =>
  failedResponseSchema.safeParse(await response.json()).data?.error;

const createFailedResponseFrom = (
  httpStatusCode: HttpStatusCode
): FailedResponse => ({
  error: withHttpStatusCode.getDescription(httpStatusCode)
});

export {
  createFailedResponseFrom,
  createPaginatedResponseSchema,
  createSucceededResponseSchema,
  failedResponseSchema,
  getErrorFrom
};
