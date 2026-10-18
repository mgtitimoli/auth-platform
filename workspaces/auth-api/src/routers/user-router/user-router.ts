import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as getCurrentUserRoute from "./get-current-user-route";

const userRoutes = [getCurrentUserRoute];

const userRouter = withRoute.attachAllTo(userRoutes, new Hono<HonoEnv>());

export {userRouter};
