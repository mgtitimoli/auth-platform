import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as getCurrentUserRoute from "./get-current-user-route";
import * as getUsersRoute from "./get-users-route";

const userRoutes = [getCurrentUserRoute, getUsersRoute];

const userRouter = withRoute.attachAllTo(userRoutes, new Hono<HonoEnv>());

export {userRouter};
