import {z} from "zod";

type EnvironmentName = (typeof environmentNames)[keyof typeof environmentNames];

const environmentNames = {
  demo: "demo",
  development: "development",
  local: "local",
  production: "production",
  test: "test"
} as const;

const environmentNameSchema = z.enum(Object.values(environmentNames));

export {environmentNameSchema, environmentNames};
export type {EnvironmentName};
