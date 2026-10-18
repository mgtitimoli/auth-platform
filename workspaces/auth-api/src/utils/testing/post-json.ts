import {router} from "@/router";

const postJson = (path: string, body: unknown, cookie?: string) =>
  router.request(path, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(cookie !== undefined && {Cookie: cookie})
    },
    method: "POST"
  });

export {postJson};
