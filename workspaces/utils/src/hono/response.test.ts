import {describe, expect, it} from "vitest";

import {getErrorFrom} from "@/hono/response";

describe("getErrorFrom", () => {
  it("returns the error of a failed response", async () => {
    const response = Response.json({error: "Not found"}, {status: 404});

    expect(await getErrorFrom(response)).toBe("Not found");
  });

  it("returns undefined for a succeeded response", async () => {
    const response = Response.json({data: {id: "1"}});

    expect(await getErrorFrom(response)).toBeUndefined();
  });
});
