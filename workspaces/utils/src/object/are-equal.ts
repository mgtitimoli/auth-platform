import type {AnyObject} from "./types";

const areEqual = (object1: AnyObject, object2: AnyObject) => {
  const keys1 = Object.keys(object1);

  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (
      object1[key] !== object2[key] ||
      !Object.prototype.hasOwnProperty.call(object2, key)
    ) {
      return false;
    }
  }

  return true;
};

export {areEqual};
