# tanstack-query

Hooks for [TanStack Query](https://tanstack.com/query) (React).

## Types

### MutationCacheListener

#### Description

Listener of the mutation cache's events (`MutationCacheNotifyEvent`).

### QueryCacheListener

#### Description

Listener of the query cache's events (`QueryCacheNotifyEvent`).

## Functions

### useMutationCacheListener

#### Description

Hook that calls the given listener with every event of the query client's
mutation cache (a mutation added, updated, removed…). The listener doesn't need
to be memoized: the latest one is always called, and the hook subscribes once.

TanStack notifies synchronously, even while another component renders (when
`useMutation` creates its observer), so the listener must filter the events
before setting any state.

#### Example

```ts
import {useMutationCacheListener} from "@mgtitimoli/utils/tanstack-query";

useMutationCacheListener(event => {
  // Each failure exactly once: an update whose action is the error
  if (event.type === "updated" && event.action.type === "error") {
    reportError(event.action.error, event.mutation);
  }
});
```

### useQueryCacheListener

#### Description

Hook that calls the given listener with every event of the query client's
query cache (a query added, updated, observed, removed…). The listener doesn't
need to be memoized: the latest one is always called, and the hook subscribes
once.

TanStack notifies synchronously, even while another component renders (when
`useQuery` creates its observer), so the listener must filter the events before
setting any state.

#### Example

```ts
import {useQueryCacheListener} from "@mgtitimoli/utils/tanstack-query";

useQueryCacheListener(event => {
  // Each failure exactly once: an update whose action is the error
  if (event.type === "updated" && event.action.type === "error") {
    reportError(event.action.error, event.query);
  }
});
```
