import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as createUserRoute from "./create-user-route";
import * as getCurrentUserRoute from "./get-current-user-route";
import * as getUsersRoute from "./get-users-route";

const userRoutes = [createUserRoute, getCurrentUserRoute, getUsersRoute];

const userRouter = withRoute.attachAllTo(userRoutes, new Hono<HonoEnv>());

export {userRouter};
