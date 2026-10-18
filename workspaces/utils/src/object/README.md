# object

## Types

### AnyObject

#### Description

It can be used when any object (`Record<string, unknown>`) is needed

#### Example

```ts
import type {AnyObject} from "@mgtitimoli/utils/object";

const getValue = <TObject extends AnyObject>(object: TObject, key: keyof TObject) =>
  object[key];
```

### AnyObjectKey

#### Description

Type that represents any possible object key (`number`, `string` or `symbol`).

### AnyObjectEntry

#### Description

Type that represents any possible object entry.

### NullishObjectEntry

#### Description

Type that represents a nullish object entry: an object entry with a `nullish` (`null` or `undefined`) value.

### ObjectEntryWith

#### Description

Type that can be used to create an object entry type with any object key and the given value type.

#### Example

```ts
import type {ObjectEntryWith} from "@mgtitimoli/utils/object";

type BooleanObjectEntry = ObjectEntryWith<boolean>;
```

### ObjectEntryOf

#### Description

Type that can be used to get the union of all the possible entries of a given object.

#### Example

```ts
import type {ObjectEntryOf} from "@mgtitimoli/utils/object";

type Person = {
  age: number;
  name: string;
};

type PersonEntry = ObjectEntryOf<Person>;

// ^ same as: Type PersonEntry = ["age", number] | ["name", string]
```

### ObjectFrom

#### Description

Type that can be used to get an object type from a union of object entry types.

#### Example

```ts
import type {ObjectFrom} from "@mgtitimoli/utils/object";

type SomeObject = ObjectFrom<["k1", string] | ["k2", boolean]>;

// ^ same as: Type SomeObject = {k1: string; k2: boolean;};
```

### PickByType

#### Description

Type that can be used to get the properties of a given object whose values are of the given type.

#### Example

```ts
import type {PickByType} from "@mgtitimoli/utils/object";

type Person = {
  age: number;
  name: string;
};

type PersonStrings = PickByType<Person, string>;

// ^ same as: type PersonStrings = {name: string}
```

### RecordFrom

#### Description

Type that can be used to convert an interface (sealed) to a record (opened), which is necessary given that we are typing the utilities with `AnyObject` (`Record<string, unknown>`), so they don't accept interfaces.

#### Example

```ts
import type {RecordFrom} from "@mgtitimoli/utils/object";

type R0 = Record<string, number>;

interface I0 {
  x: number
}

type R1 = RecordFrom<I0>;

const c0: I0 = { x: 1 };

// The following fails as c0 is typed with an interface (sealed) and we are
// trying to a record (opened).
const c1: R0 = c0; // error

// The following statements work as we created a record type called R1 from the
// interface I0, so we can now use this instead of the interface.
const c2: R1 = c0;
const c4: R0 = c2;
```

## Functions

### areEqual

#### Description

Function that receives 2 objects and returns `true` if they are shallow equal or `false` otherwise.

#### Example

```ts
import {areEqual} from "@mgtitimoli/utils/object";

console.log(areEqual({key: "value"}, {key: "value"})); // true
console.log(areEqual({key: {}}, {key: {}})); // false
```

### compareUsing

#### Description

Function to compare 2 objects using a `compareValues` function to compare the values obtained from each of the objects using the given `getValueToCompare` function.

#### Example

```ts
import {compareUsing} from "@mgtitimoli/utils/object";

type MyObject = {
  k1: string;
};

const compareStrings = (value1: string, value2: string) =>
  value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

const compareByK1 = compareUsing((object: MyObject) => object.k1, compareStrings);

console.log(compareByK1({k1: "abc"}, {k1: "abc"})); // 0
console.log(compareByK1({k1: "def"}, {k1: "abc"})); // 1
console.log(compareByK1({k1: "abc"}, {k1: "def"})); // -1
```

### getEntries

#### Description

Same as [Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) but it returns an array of typed object entries.

#### Example

```ts
import {getEntries} from "@mgtitimoli/utils/object";

const [firstEntry, secondEntry] = getEntries({name: "Mauro", age: 42});

if (firstEntry[0] === "age") {
  console.log(firstEntry[1].length);
}
```

### hasEntries

#### Description

Function that returns a boolean indicating if the given object has at least one entry.

#### Example

```ts
import {hasEntries} from "@mgtitimoli/utils/object";

console.log(hasEntries({k0: 0})); // true
console.log(hasEntries({})); // false
```

### hasProperty

#### Description

[Type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) function that returns a boolean indicating if the given object has an entry with the given key.

> This is needed for cases where we have non-record objects (keys are literal) and we need to test if some string is a key of it, which in this case TS throws an error.

#### Example

```ts
import {hasProperty} from "@mgtitimoli/utils/object";

const key: string = "someKey";

const obj = {
  someKey: 0,
  someOtherKey: 1
};

if (hasProperty(obj, key)) {
  console.log(obj[key]);
}
```

### isNullishEntry

#### Description

[Type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) function that returns a boolean indicating if the given entry value is `nullish` (`null` or `undefined`).

### mapValues

#### Description

Function to create an object with the same keys as the given one, mapping each of its values with the given function.

#### Example

```ts
import {mapValues} from "@mgtitimoli/utils/object";

console.log(mapValues({k0: 1, k1: 2}, value => value * 2)); // {k0: 2, k1: 4}
```

### omitEntries

#### Description

Function that omit entries from the given object based on the provided [Type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) function.

#### Example

```ts
import {omitEntries} from "@mgtitimoli/utils/object";
import type {ObjectEntryWith} from "@mgtitimoli/utils/object";

const obj = {
  k0: 0,
  k1: 1,
  k2: true
};

const result = omitEntries(
  obj,
  (entry): entry is Extract<typeof entry, ObjectEntryWith<boolean>> =>
    typeof entry[1] === "boolean"
);

console.log(result); // {k0: 0, k1: 1}
```

### pick

#### Description

Function to create an object by picking properties from an another one.

#### Example

```ts
import {pick} from "@mgtitimoli/utils/object";

const obj = {
  k0: 0,
  k1: 1,
  k2: 2
};

console.log(pick(obj, ["k0",  "k2"])); // {k0: 0, k2: 2}
```

### setEntry

#### Description

Function that set the given entry to the provided object.

#### Example

```ts
import {setEntry} from "@mgtitimoli/utils/object";

const obj = {
  k0: 0,
  k1: 1
};

console.log(setEntry(obj, ["k1", 2])); // {k0: 0, k1: 2}
```
