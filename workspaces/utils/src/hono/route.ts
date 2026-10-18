import type {Env, Hono} from "hono";

type Route<THonoEnv extends Env> = {
  attachTo: (router: Hono<THonoEnv>) => Hono<THonoEnv>;
};

const attachAllTo = <THonoEnv extends Env>(
  routes: Route<THonoEnv>[],
  router: Hono<THonoEnv>
) => routes.reduce((hono, route) => route.attachTo(hono), router);

export {attachAllTo};
export type {Route};
