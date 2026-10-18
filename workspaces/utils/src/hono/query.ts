import {z} from "zod";
import type {ZodType} from "zod";

import {arrayify} from "@/zod";

const createPaginationQuerySchema = (maxLimit = 4000, defaultLimit = 4000) =>
  z.object({
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(maxLimit)
      .default(defaultLimit),
    offset: z.coerce.number().int().nonnegative().default(0)
  });

const arrayQuerySchema = <TSchema extends ZodType>(schema: TSchema) =>
  arrayify(z.array(schema).nonempty());

const booleanQuerySchema = z.preprocess(value => value === "true", z.boolean());

const nullishQueryParam = <TSchema extends ZodType>(schema: TSchema) =>
  z
    .preprocess(val => (val === "null" ? null : val), schema.nullish())
    // we need to make it optional again as preprocess makes hono lose track
    // of this
    .optional();

export {
  arrayQuerySchema,
  booleanQuerySchema,
  createPaginationQuerySchema,
  nullishQueryParam
};
