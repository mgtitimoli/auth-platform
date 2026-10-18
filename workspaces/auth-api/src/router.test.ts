import {describe, expect, it} from "vitest";

import {router} from "@/router";
import {environmentVariables} from "@/utils/environment/environment-variables";

const preflight = (origin: string) =>
  router.request("/users/me", {
    headers: {
      "Access-Control-Request-Method": "GET",
      Origin: origin
    },
    method: "OPTIONS"
  });

describe("CORS", () => {
  it("allows the backoffice, with credentials", async () => {
    const response = await preflight(environmentVariables.AUTH_BACKOFFICE_URL);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      environmentVariables.AUTH_BACKOFFICE_URL
    );
    expect(response.headers.get("Access-Control-Allow-Credentials")).toBe(
      "true"
    );
  });

  it("doesn't allow any other origin", async () => {
    const response = await preflight("https://example.com");

    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});
