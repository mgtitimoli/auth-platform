type JsonUpdates = {
  dataToMerge: Record<string, unknown>;
  keysToRemove: string[];
};

type ShouldRemoveEntry = (key: string, value: unknown) => boolean;

const emptyJsonUpdates: JsonUpdates = {
  dataToMerge: {},
  keysToRemove: []
};

const addDataToMerge = (
  updates: JsonUpdates,
  dataToMerge: Record<string, unknown>
) => ({
  ...updates,
  dataToMerge: {...updates.dataToMerge, ...dataToMerge}
});

const addKeyToRemove = (updates: JsonUpdates, key: string) => ({
  ...updates,
  keysToRemove: [...updates.keysToRemove, key]
});

const removeNullEntry: ShouldRemoveEntry = (_key, value) => value === null;

const getFrom = (
  data: Record<string, unknown>,
  shouldRemoveEntry: ShouldRemoveEntry = removeNullEntry
) =>
  Object.entries(data).reduce(
    (updates, [key, value]) =>
      shouldRemoveEntry(key, value)
        ? addKeyToRemove(updates, key)
        : addDataToMerge(updates, {[key]: value}),
    emptyJsonUpdates
  );

const isEmpty = ({dataToMerge, keysToRemove}: JsonUpdates) =>
  Object.keys(dataToMerge).length === 0 && keysToRemove.length === 0;

export {getFrom, isEmpty};
export type {JsonUpdates, ShouldRemoveEntry};
