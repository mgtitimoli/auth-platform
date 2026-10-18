import {getEntries} from "./get-entries";
import {setEntry} from "./set-entry";
import type {AnyObject, ObjectEntryOf, ObjectFrom} from "./types";

const omitEntries = <
  TObject extends AnyObject,
  TFilteredEntry extends ObjectEntryOf<TObject>
>(
  object: TObject,
  filterEntry: (entry: ObjectEntryOf<TObject>) => entry is TFilteredEntry
) =>
  getEntries(object).reduce(
    (result, entry) => (filterEntry(entry) ? result : setEntry(result, entry)),
    {} as ObjectFrom<Exclude<ObjectEntryOf<TObject>, TFilteredEntry>>
  );

export {omitEntries};
