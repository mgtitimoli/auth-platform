type AnyObject = Record<string, unknown>;

const isObject = <TValue>(value: TValue): value is Extract<TValue, AnyObject> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export {isObject};
