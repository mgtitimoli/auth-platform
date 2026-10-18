import type {AnyObjectEntry, NullishObjectEntry} from "./types";

const isNullishEntry = <TEntry extends AnyObjectEntry>(
  entry: TEntry
): entry is Extract<TEntry, NullishObjectEntry> =>
  entry[1] === null || entry[1] === undefined;

export {isNullishEntry};
