import {z} from "zod";
import type {ZodType} from "zod";

const cursorPaginationSchema = z
  .object({
    nextCursor: z.string().nullable()
  })
  .meta({
    ref: "CursorPagination"
  });

const createCursorResponseSchema = <TZodType extends ZodType>(
  schema: TZodType,
  ref: string
) =>
  z
    .object({
      data: schema,
      pagination: cursorPaginationSchema
    })
    .meta({
      ref
    });

export {createCursorResponseSchema};
