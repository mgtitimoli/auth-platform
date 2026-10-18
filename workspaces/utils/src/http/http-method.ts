type HttpMethod = (typeof httpMethods)[keyof typeof httpMethods];

const httpMethods = {
  delete: "DELETE",
  get: "GET",
  patch: "PATCH",
  post: "POST",
  put: "PUT"
} as const;

const allHttpMethods = Object.values(httpMethods);

const isHttpMethod = (value: string): value is HttpMethod =>
  (allHttpMethods as string[]).includes(value);

const getFrom = (value: string) => {
  if (!isHttpMethod(value)) {
    throw new Error("Expected a http method, but instead got: " + value);
  }

  return value;
};

export {getFrom, httpMethods, isHttpMethod};
export type {HttpMethod};
