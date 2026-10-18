import type {HttpStatusCode} from "@/http/http-status-code";

type HttpStatusCodeClass =
  (typeof httpStatusCodeClasses)[keyof typeof httpStatusCodeClasses];

const httpStatusCodeClasses = {
  clientError: 4,
  informational: 1,
  redirection: 3,
  serverError: 5,
  success: 2
} as const;

const httpStatusCodeClassDescriptions = {
  [httpStatusCodeClasses.clientError]: "Client Error",
  [httpStatusCodeClasses.informational]: "Informational",
  [httpStatusCodeClasses.redirection]: "Redirection",
  [httpStatusCodeClasses.serverError]: "Server Error",
  [httpStatusCodeClasses.success]: "Success"
} as const;

const getDescription = (httpStatusCodeClass: HttpStatusCodeClass) =>
  httpStatusCodeClassDescriptions[httpStatusCodeClass];

const getFrom = (httpStatusCode: HttpStatusCode) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Math.trunc(httpStatusCode / 100) as HttpStatusCodeClass;

export {getDescription, getFrom, httpStatusCodeClasses};
export type {HttpStatusCodeClass};
