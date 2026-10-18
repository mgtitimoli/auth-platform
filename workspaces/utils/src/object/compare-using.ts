import type {AnyObject} from "./types";

type CompareResult = -1 | 0 | 1;

type CompareValues<TValue> = (value1: TValue, value2: TValue) => CompareResult;

type GetValueToCompare<TObject extends AnyObject, TValue> = (
  object: TObject
) => TValue;

const compareUsing =
  <TObject extends AnyObject, TValue>(
    getValueToCompare: GetValueToCompare<TObject, TValue>,
    compareValues: CompareValues<TValue>
  ) =>
  (object1: TObject, object2: TObject) =>
    compareValues(getValueToCompare(object1), getValueToCompare(object2));

export {compareUsing};
