import {useRouter} from "next/navigation";
import {useTransition} from "react";

const useSignUpScreen = () => {
  const router = useRouter();

  // router.push returns nothing to await: the transition stays pending until
  // the next page renders
  const [isNavigating, startTransition] = useTransition();

  const onSignUp = () => startTransition(() => router.push("/users"));

  return {isNavigating, onSignUp};
};

export {useSignUpScreen};
