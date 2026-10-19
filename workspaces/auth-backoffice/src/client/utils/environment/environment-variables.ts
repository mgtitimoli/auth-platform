import {z} from "zod";

type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;

const environmentVariablesSchema = z.object({
  AUTH_API_URL: z.url()
});

const environmentVariables = environmentVariablesSchema.parse({
  // Next inlines NEXT_PUBLIC_* at build time only when written out literally
  AUTH_API_URL: process.env["NEXT_PUBLIC_AUTH_API_URL"]
});

export {environmentVariables};
export type {EnvironmentVariables};
