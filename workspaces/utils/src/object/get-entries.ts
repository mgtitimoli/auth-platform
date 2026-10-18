import type {AnyObject, ObjectEntryOf} from "./types";

const getEntries = <TObject extends AnyObject>(object: TObject) =>
  Object.entries(object) as ObjectEntryOf<TObject>[];

export {getEntries};
