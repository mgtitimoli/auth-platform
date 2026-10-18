import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as createUserRoute from "./create-user-route";
import * as getCurrentUserRoute from "./get-current-user-route";
import * as getUsersRoute from "./get-users-route";
import * as updateUserRoute from "./update-user-route";

// Routes are matched in order: /me before /:userId, so it isn't taken for an id
const userRoutes = [
  createUserRoute,
  getCurrentUserRoute,
  getUsersRoute,
  updateUserRoute
];

const userRouter = withRoute.attachAllTo(userRoutes, new Hono<HonoEnv>());

export {userRouter};
