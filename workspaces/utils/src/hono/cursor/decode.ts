import type {ZodType, z} from "zod";

import {InvalidCursorError} from "./invalid-cursor-error";

const decode = <TSchema extends ZodType>(
  cursor: string,
  cursorSchema: TSchema
): z.infer<TSchema> => {
  try {
    const decodedCursor = Buffer.from(cursor, "base64url").toString("utf8");

    const parsedCursor: unknown = JSON.parse(decodedCursor);

    return cursorSchema.parse(parsedCursor);
  } catch (error) {
    throw new InvalidCursorError("The cursor is invalid", {cause: error});
  }
};

export {decode};
