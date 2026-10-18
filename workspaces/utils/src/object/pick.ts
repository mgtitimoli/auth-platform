import type {AnyObject} from "./types";

const pick = <TObject extends AnyObject, TKey extends keyof TObject>(
  object: TObject,
  keys: TKey[]
) =>
  keys.reduce(
    (result, key) => ({
      ...result,
      [key]: object[key]
    }),
    {} as Pick<TObject, TKey>
  );

export {pick};
