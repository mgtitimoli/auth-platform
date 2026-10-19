import {useQueryClient} from "@tanstack/react-query";
import type {MutationCacheNotifyEvent} from "@tanstack/react-query";
import {useEffect, useEffectEvent} from "react";

type MutationCacheListener = (event: MutationCacheNotifyEvent) => unknown;

const useMutationCacheListener = (
  mutationCacheListener: MutationCacheListener
): void => {
  const mutationCache = useQueryClient().getMutationCache();

  const onMutationCacheEvent = useEffectEvent(mutationCacheListener);

  useEffect(
    () =>
      mutationCache.subscribe(event => {
        onMutationCacheEvent(event);
      }),
    [mutationCache]
  );
};

export {useMutationCacheListener};
export type {MutationCacheListener};
