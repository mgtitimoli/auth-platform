import {describe, expect, it} from "vitest";
import {z} from "zod";

import {decode} from "./decode";
import {encode} from "./encode";

const cursorSchema = z.object({
  id: z.uuid(),
  startsAt: z.iso.datetime()
});

const cursor = {
  id: "33333333-3333-4333-8333-333333333333",
  startsAt: "2026-09-21T00:00:00.000Z"
};

describe("decode", () => {
  it("round-trips a cursor produced by encode", () => {
    expect(decode(encode(cursor), cursorSchema)).toEqual(cursor);
  });

  it("rejects a malformed base64url cursor", () => {
    expect(() => decode("not-a-cursor", cursorSchema)).toThrow(
      "The cursor is invalid"
    );
  });

  it("rejects a cursor that does not hold JSON", () => {
    const notJson = Buffer.from("not json").toString("base64url");

    expect(() => decode(notJson, cursorSchema)).toThrow(
      "The cursor is invalid"
    );
  });

  it("rejects a cursor whose payload fails the schema", () => {
    const invalidPayload = encode({...cursor, id: "not-a-uuid"});

    expect(() => decode(invalidPayload, cursorSchema)).toThrow(
      "The cursor is invalid"
    );
  });
});
