import * as withRoute from "@mgtitimoli/utils/hono/route";
import {Hono} from "hono";

import type {HonoEnv} from "@/hono-env";

import * as signUpRoute from "./sign-up-route";

const authRoutes = [signUpRoute];

const authRouter = withRoute.attachAllTo(authRoutes, new Hono<HonoEnv>());

export {authRouter};
