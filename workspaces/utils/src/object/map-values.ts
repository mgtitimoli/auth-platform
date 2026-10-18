import type {AnyObject} from "./types";

type ValueMapper<TObject extends AnyObject> = (
  value: TObject[keyof TObject],
  key: keyof TObject,
  object: TObject
) => unknown;

const mapValues = <TObject extends AnyObject>(
  object: TObject,
  mapValue: ValueMapper<TObject>
) =>
  Object.entries(object).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: mapValue(value as TObject[keyof TObject], key, object)
    }),
    {} as Record<keyof TObject, any>
  );

export {mapValues};
