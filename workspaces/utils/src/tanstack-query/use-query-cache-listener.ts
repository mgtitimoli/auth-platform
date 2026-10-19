import {useQueryClient} from "@tanstack/react-query";
import type {QueryCacheNotifyEvent} from "@tanstack/react-query";
import {useEffect} from "react";

import {useLatestRef} from "@/react";

type QueryCacheListener = (event: QueryCacheNotifyEvent) => unknown;

const useQueryCacheListener = (
  queryCacheListener: QueryCacheListener
): void => {
  const queryCache = useQueryClient().getQueryCache();

  // TanStack notifies synchronously, even while another component renders
  // (when useQuery creates its observer), so this can't be a useEffectEvent
  const queryCacheListenerRef = useLatestRef(queryCacheListener);

  useEffect(
    () =>
      queryCache.subscribe(event => {
        queryCacheListenerRef.current(event);
      }),
    [queryCache, queryCacheListenerRef]
  );
};

export {useQueryCacheListener};
export type {QueryCacheListener};
