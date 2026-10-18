// Escapes LIKE/ILIKE wildcards (`%`, `_`) and the escape character itself so
// that user input is matched literally rather than acting as a pattern. Relies
// on the default backslash escape character. The result is meant to be wrapped
// in `%...%` and passed as a bound parameter.
const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, "\\$&");

export {escapeLikePattern};
