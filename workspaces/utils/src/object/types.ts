type AnyObject = Record<string, unknown>;

type AnyObjectKey = number | string | symbol;

type ObjectEntryWith<TValue> = [AnyObjectKey, TValue];

type AnyObjectEntry = ObjectEntryWith<unknown>;

type NullishObjectEntry = ObjectEntryWith<null | undefined>;

type ObjectEntryOf<TObject extends AnyObject> = {
  [TKey in keyof TObject]: [TKey, TObject[TKey]];
}[keyof TObject];

type ObjectFrom<TObjectEntry extends AnyObjectEntry> = {
  [CurObjectEntry in TObjectEntry as CurObjectEntry[0]]: CurObjectEntry[1];
};

type PickByType<TObject extends AnyObject, TValue> = {
  [
    Key in keyof TObject as TObject[Key] extends TValue | undefined
      ? Key
      : never
  ]: TObject[Key];
};

type RecordFrom<TObject extends object> = Pick<TObject, keyof TObject>;

export type {
  AnyObject,
  AnyObjectEntry,
  AnyObjectKey,
  NullishObjectEntry,
  ObjectEntryOf,
  ObjectEntryWith,
  ObjectFrom,
  PickByType,
  RecordFrom
};
