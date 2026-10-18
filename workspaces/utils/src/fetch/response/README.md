# response

Utilities for the Fetch API's [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

## Functions

### getCookie

#### Description

Function that returns the value of the given cookie set by the response
(`Set-Cookie`), or `undefined` if the response doesn't set it. Browsers hide
`Set-Cookie` from JavaScript, so it only works outside them (e.g. in Node.js
tests).

#### Example

```ts
import * as withResponse from "@mgtitimoli/utils/fetch/response";

const sessionId = withResponse.getCookie(response, "session");
```
