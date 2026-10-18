import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as createUserRoute from "./create-user-route";
import * as deleteUserRoute from "./delete-user-route";
import * as getCurrentUserRoute from "./get-current-user-route";
import * as getUsersRoute from "./get-users-route";
import * as updateUserRoute from "./update-user-route";

const userRoutes = [
  createUserRoute,
  deleteUserRoute,
  getCurrentUserRoute,
  getUsersRoute,
  updateUserRoute
];

const userRouter = withRoute.attachAllTo(userRoutes, new Hono<HonoEnv>());

export {userRouter};
