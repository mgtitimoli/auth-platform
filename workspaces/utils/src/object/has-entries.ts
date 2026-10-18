import type {AnyObject} from "./types";

const hasEntries = (object: AnyObject): boolean =>
  Object.keys(object).length > 0;

export {hasEntries};
