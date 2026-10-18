import type {AnyObject, ObjectEntryOf} from "./types";

const setEntry = <
  TObject extends AnyObject,
  TEntry extends ObjectEntryOf<TObject>
>(
  object: TObject,
  [key, value]: TEntry
) => ({
  ...object,
  [key]: value
});

export {setEntry};
