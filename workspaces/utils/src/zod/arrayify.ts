import z from "zod";
import type {ZodType} from "zod";

const arrayify = <TSchema extends ZodType>(schema: TSchema) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  z.preprocess(val => (Array.isArray(val) ? val : [val]), schema);

export {arrayify};
