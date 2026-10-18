import {logLevelSchema} from "@mgtitimoli/utils/logging/log-level";
import {passwordHashCostSchema} from "@mgtitimoli/utils/password/password-hash-cost";
import {mapIfDefined} from "@mgtitimoli/utils/validation";
import {z} from "zod";

import {environmentNameSchema} from "./environment-name";

type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

const environmentVariablesSchema = z.object({
  AUTH_API_PORT: z.number().int().positive(),
  // The only origin allowed to call the API from a browser (CORS)
  AUTH_BACKOFFICE_URL: z.url(),
  AUTH_DATABASE_URL: z.url({protocol: /^postgres(ql)?$/}),
  ENVIRONMENT_NAME: environmentNameSchema,
  LOG_LEVEL: logLevelSchema.default("info"),
  LOGS_RETAINED: z.boolean(),
  PASSWORD_HASH_COST: passwordHashCostSchema.optional(),
  // Unset locally: the cookie is then sent only to the API's own host
  SESSION_COOKIE_DOMAIN: z.string().min(1).optional(),
  SESSION_COOKIE_SECURE: z.boolean(),
  // Timestamps without a time zone are read back against the process zone, so
  // anything but UTC shifts them silently.
  TZ: z.literal("UTC")
});

const environmentVariables = environmentVariablesSchema.parse({
  AUTH_API_PORT: mapIfDefined(process.env["AUTH_API_PORT"], Number),
  AUTH_BACKOFFICE_URL: process.env["AUTH_BACKOFFICE_URL"],
  AUTH_DATABASE_URL: process.env["AUTH_DATABASE_URL"],
  ENVIRONMENT_NAME: process.env["ENVIRONMENT_NAME"],
  LOG_LEVEL: process.env["LOG_LEVEL"],
  LOGS_RETAINED: process.env["LOGS_RETAINED"] === "true",
  PASSWORD_HASH_COST: mapIfDefined(process.env["PASSWORD_HASH_COST"], Number),
  SESSION_COOKIE_DOMAIN: process.env["SESSION_COOKIE_DOMAIN"],
  SESSION_COOKIE_SECURE: process.env["SESSION_COOKIE_SECURE"] === "true",
  TZ: process.env["TZ"]
});

export {environmentVariables};
export type {EnvironmentVariables};
