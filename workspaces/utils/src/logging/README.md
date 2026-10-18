# logging

## Functions

### createJsonLogger

#### Description

Function that creates a [pino](https://getpino.io) logger that writes JSON lines with ISO timestamps.

#### Example

```ts
import {createJsonLogger} from "@mgtitimoli/utils/logging/json-logger";

const logger = createJsonLogger({logLevel: "info"});

logger.info("Server started");
```

## Modules

- [log-level](./log-level.ts)
