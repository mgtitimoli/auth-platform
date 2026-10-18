import {describe, expect, it} from "vitest";

import {getCookie} from "./get-cookie";

const createResponse = (setCookies: string[]) => {
  const headers = new Headers();

  setCookies.forEach(setCookie => headers.append("Set-Cookie", setCookie));

  return new Response(null, {headers});
};

describe("getCookie", () => {
  it("returns the value of the given cookie", () => {
    const response = createResponse([
      "theme=dark; Path=/",
      "session=abc123; Path=/; HttpOnly"
    ]);

    expect(getCookie(response, "session")).toBe("abc123");
  });

  it("returns an empty value for a removed cookie", () => {
    const response = createResponse(["session=; Max-Age=0; Path=/"]);

    expect(getCookie(response, "session")).toBe("");
  });

  it("returns undefined when the response doesn't set the cookie", () => {
    const response = createResponse(["sessions=abc123"]);

    expect(getCookie(response, "session")).toBeUndefined();
  });
});
