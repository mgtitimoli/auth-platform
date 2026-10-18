import {z} from "zod";

const jsonSchema = <TSchema extends z.ZodType>(schema: TSchema) =>
  z
    .string()
    .transform((value, ctx) => {
      try {
        return JSON.parse(value) as unknown;
      } catch (error) {
        ctx.addIssue({
          code: "custom",
          message: error instanceof Error ? error.message : String(error)
        });

        return z.NEVER;
      }
    })
    .pipe(schema);

export {jsonSchema};
