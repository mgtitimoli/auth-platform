# react

Hooks for [React](https://react.dev).

## Functions

### useLatestRef

#### Description

Hook that returns a ref holding the latest value it was given, updated on
commit. Callbacks that outlive a render (subscriptions, timers) read
`ref.current` to always get the newest value without resubscribing.

Unlike `useEffectEvent`, the ref can be read at any time, including while
another component renders: libraries such as TanStack Query notify their
subscribers synchronously, even during render.

#### Example

```ts
import {useLatestRef} from "@mgtitimoli/utils/react";

const listenerRef = useLatestRef(listener);

useEffect(
  () =>
    store.subscribe(event => {
      listenerRef.current(event);
    }),
  [store]
);
```
