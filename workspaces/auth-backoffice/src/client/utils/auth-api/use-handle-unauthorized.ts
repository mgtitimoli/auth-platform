import {AuthApiResponseError} from "@mgtitimoli/auth-api-tools/auth-api-response-error";
import * as withHttpStatusCode from "@mgtitimoli/utils/http/http-status-code";
import {
  useMutationCacheListener,
  useQueryCacheListener
} from "@mgtitimoli/utils/tanstack-query";
import {useQueryClient} from "@tanstack/react-query";
import type {
  MutationCacheNotifyEvent,
  MutationKey,
  QueryCacheNotifyEvent
} from "@tanstack/react-query";
import {useState} from "react";

type CacheEvent = MutationCacheNotifyEvent | QueryCacheNotifyEvent;

const {httpStatusCodes} = withHttpStatusCode;

// openapi-react-query keys every mutation by [method, path]
const isSignInMutationKey = (mutationKey?: MutationKey) => {
  const [method, path] = mutationKey ?? [];

  return method === "post" && path === "/auth/sign-in";
};

const isUnauthorizedErrorEvent = (event: CacheEvent) => {
  if (event.type !== "updated" || event.action.type !== "error") {
    return false;
  }

  // Sign-in's 401 means wrong credentials, not an ended session
  const isSignIn =
    "mutation" in event &&
    isSignInMutationKey(event.mutation.options.mutationKey);

  return (
    event.action.error instanceof AuthApiResponseError &&
    event.action.error.status === httpStatusCodes.unauthorized &&
    !isSignIn
  );
};

const useHandleUnauthorized = (onUnauthorized: () => unknown) => {
  const queryClient = useQueryClient();

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleCacheEvent = (event: CacheEvent) => {
    if (!isUnauthorizedErrorEvent(event)) {
      return;
    }

    setIsUnauthorized(true);

    // The previous user's data must not survive a client-side navigation
    queryClient.clear();

    onUnauthorized();
  };

  useQueryCacheListener(handleCacheEvent);
  useMutationCacheListener(handleCacheEvent);

  return {isUnauthorized};
};

export {useHandleUnauthorized};
