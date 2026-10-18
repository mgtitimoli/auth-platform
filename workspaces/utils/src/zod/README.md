# zod

## Functions

### arrayify

#### Description

Function that wraps an array schema so a single value is accepted as a
one-element array (useful for query parameters that may appear once or many
times).

#### Example

```ts
import {z} from "zod";

import {arrayify} from "@mgtitimoli/utils/zod";

const idsSchema = arrayify(z.array(z.string()));

idsSchema.parse("a"); // ["a"]
idsSchema.parse(["a", "b"]); // ["a", "b"]
```

### jsonSchema

#### Description

Function that returns a schema for a JSON string: it parses the string and
validates the result with the given schema, reporting invalid JSON as an issue.

#### Example

```ts
import {z} from "zod";

import {jsonSchema} from "@mgtitimoli/utils/zod";

const filterSchema = jsonSchema(z.object({name: z.string()}));

filterSchema.parse('{"name":"Ada"}'); // {name: "Ada"}
```
