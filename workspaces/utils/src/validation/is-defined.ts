const isDefined = <TValue>(value: TValue): value is NonNullable<TValue> =>
  value !== null && value !== undefined;

export {isDefined};
