import {useQueryClient} from "@tanstack/react-query";

import {authApi} from "./auth-api";

const useSignOut = (onSignOut: () => unknown) => {
  const queryClient = useQueryClient();

  const signOut = authApi.useMutation("post", "/auth/sign-out", {
    onSuccess: () => {
      // The next user must not see this one's data
      queryClient.clear();

      onSignOut();
    }
  });

  return () => {
    signOut.mutate({});
  };
};

export {useSignOut};
