import {z} from "zod";

const createCursorQuerySchema = (maxLimit = 100) =>
  z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().positive().max(maxLimit).optional()
  });

export {createCursorQuerySchema};
