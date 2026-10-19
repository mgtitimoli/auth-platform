import {useQueryClient} from "@tanstack/react-query";
import type {QueryCacheNotifyEvent} from "@tanstack/react-query";
import {useEffect, useEffectEvent} from "react";

type QueryCacheListener = (event: QueryCacheNotifyEvent) => unknown;

const useQueryCacheListener = (
  queryCacheListener: QueryCacheListener
): void => {
  const queryCache = useQueryClient().getQueryCache();

  const onQueryCacheEvent = useEffectEvent(queryCacheListener);

  useEffect(
    () =>
      queryCache.subscribe(event => {
        onQueryCacheEvent(event);
      }),
    [queryCache]
  );
};

export {useQueryCacheListener};
export type {QueryCacheListener};
