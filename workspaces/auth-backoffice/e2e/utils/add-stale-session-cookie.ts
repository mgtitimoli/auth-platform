import type {BrowserContext} from "@playwright/test";

// A cookie whose session doesn't exist, as after a terminated session
const addStaleSessionCookie = (context: BrowserContext) =>
  context.addCookies([
    {domain: "localhost", name: "session", path: "/", value: "stale"}
  ]);

export {addStaleSessionCookie};
