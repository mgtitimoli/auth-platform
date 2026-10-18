const createFrom = (value: unknown, defaultMessage: string): Error => {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === "string") {
    return new Error(value);
  }

  return new Error(defaultMessage, {cause: value});
};

export {createFrom};
