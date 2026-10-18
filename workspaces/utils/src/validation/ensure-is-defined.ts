import {isDefined} from "./is-defined";

const ensureIsDefined = <TValue>(value: TValue, errorMessage: string) => {
  if (!isDefined(value)) {
    throw new Error(errorMessage);
  }

  return value;
};

export {ensureIsDefined};
