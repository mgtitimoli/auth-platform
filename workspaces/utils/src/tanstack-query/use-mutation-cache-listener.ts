import {useQueryClient} from "@tanstack/react-query";
import type {MutationCacheNotifyEvent} from "@tanstack/react-query";
import {useEffect} from "react";

import {useLatestRef} from "@/react";

type MutationCacheListener = (event: MutationCacheNotifyEvent) => unknown;

const useMutationCacheListener = (
  mutationCacheListener: MutationCacheListener
): void => {
  const mutationCache = useQueryClient().getMutationCache();

  // TanStack notifies synchronously, even while another component renders
  // (when useMutation creates its observer), so this can't be a useEffectEvent
  const mutationCacheListenerRef = useLatestRef(mutationCacheListener);

  useEffect(
    () =>
      mutationCache.subscribe(event => {
        mutationCacheListenerRef.current(event);
      }),
    [mutationCache, mutationCacheListenerRef]
  );
};

export {useMutationCacheListener};
export type {MutationCacheListener};
