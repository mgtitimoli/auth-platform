import {logLevelSchema} from "@mgtitimoli/utils/logging/log-level";
import {mapIfDefined} from "@mgtitimoli/utils/validation";
import {z} from "zod";

import {environmentNameSchema} from "./environment-name";

type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

const environmentVariablesSchema = z.object({
  AUTH_API_PORT: z.number().int().positive(),
  ENVIRONMENT_NAME: environmentNameSchema,
  LOG_LEVEL: logLevelSchema.default("info"),
  LOGS_RETAINED: z.boolean(),
  // Timestamps without a time zone are read back against the process zone, so
  // anything but UTC shifts them silently.
  TZ: z.literal("UTC")
});

const environmentVariables = environmentVariablesSchema.parse({
  AUTH_API_PORT: mapIfDefined(process.env["AUTH_API_PORT"], Number),
  ENVIRONMENT_NAME: process.env["ENVIRONMENT_NAME"],
  LOG_LEVEL: process.env["LOG_LEVEL"],
  LOGS_RETAINED: process.env["LOGS_RETAINED"] === "true",
  TZ: process.env["TZ"]
});

export {environmentVariables};
export type {EnvironmentVariables};
