// https://www.postgresql.org/docs/current/errcodes-appendix.html
const uniqueViolationCode = "23505";

const isUniqueViolation = (error: unknown, constraintName: string): boolean =>
  error instanceof Error &&
  "code" in error &&
  error.code === uniqueViolationCode &&
  "constraint" in error &&
  error.constraint === constraintName;

export {isUniqueViolation};
