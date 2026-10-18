import type {AnyObject} from "./types";

const hasProperty = <TObject extends AnyObject>(
  object: TObject,
  key: keyof TObject | string
): key is keyof TObject => (key as string) in object;

export {hasProperty};
