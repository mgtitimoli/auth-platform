import {z} from "zod";

type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

// The tests run in an environment loaded by auth-api's env run
const environmentVariablesSchema = z.object({
  AUTH_API_PORT: z.string(),
  AUTH_BACKOFFICE_URL: z.url()
});

const environmentVariables = environmentVariablesSchema.parse(process.env);

export {environmentVariables};
export type {EnvironmentVariables};
