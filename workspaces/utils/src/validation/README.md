# validation

## Functions

### ensureIsDefined

#### Description

Function that returns the given value if it's defined, and throws an error with the given message otherwise (it's null or undefined).

#### Example

```ts
import {ensureIsDefined} from "@mgtitimoli/utils/validation";

const test = (arg0: number | undefined | null) => {
  const value = ensureIsDefined(arg0, "arg0 is required");

  // here value is refined to number
};
```

### isDefined

#### Description

Function that returns a boolean indicating if the given value is defined (it's not null or undefined).

#### Example

```ts
import {isDefined} from "@mgtitimoli/utils/validation";

const test = (arg0: number | undefined | null) => {
  if (isDefined(arg0)) {
    // here arg0 is refined to number
  }

  // here arg0 could be undefined | null
};
```

### isObject

#### Description

Function that returns a boolean indicating if the given value is an object.

> This function exists because `typeof value === "object` returns `true` for arrays and null.

#### Example

```ts
import {isObject} from "@mgtitimoli/utils/validation";

type T0 ={
  k0: number;
};

const test = (arg0: T0 | null | unknown[]) => {
  if (isObject(arg0)) {
    // here arg0 is refined to T0
  }

  // here arg0 could be T0 | null | unknown[]
};
```

### isUrl

#### Description

Function that returns a boolean indicating if the given value is an url.

#### Example

```ts
import {isUrl} from "@mgtitimoli/utils/validation";

console.log(isUrl("http://localhost:3000")); // true
console.log(isUrl("https://www.google.com")); // true
console.log(isUrl("https://www.google.com/search")); // true
console.log(isUrl("https://www.google.com/search?q=something")); // true
console.log(isUrl("htt://localhost:3000")); // false
console.log(isUrl("https://")); // false
```

### mapIfDefined

#### Description

Function that maps a value only if it's defined (not null or undefined).

#### Example

```ts
import {mapIfDefined} from "@mgtitimoli/utils/validation";

// here the returned type of test would be string | null | undefined as we are
// using the String constructor to map arg0 numbers.
const test = (arg0: number | null | undefined) =>
  mapIfDefined(arg0, String);
```
