# error

## Classes

### CustomError

#### Description

Base class for custom errors: it sets `name` to the class name, so errors
extending it can be told apart in logs and with `instanceof`.

#### Example

```ts
import {CustomError} from "@mgtitimoli/utils/error";

class NotFoundError extends CustomError {}

const error = new NotFoundError("Not found");

error.name; // "NotFoundError"
```

## Functions

### createFrom

#### Description

Function that returns an `Error` from any thrown value: the value itself if
it's already an `Error`, a new `Error` with the value as message if it's a
string, or a new `Error` with the given default message and the value as cause
otherwise.

#### Example

```ts
import {createFrom} from "@mgtitimoli/utils/error";

try {
  doSomething();
} catch (value) {
  logger.error(createFrom(value, "Something failed"));
}
```
