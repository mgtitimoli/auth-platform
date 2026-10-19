import {useTheme} from "@wrksz/themes/client";
import {useRouter} from "next/navigation";

import {useHandleUnauthorized} from "@/client/utils/auth-api";

const usePrivateLayout = () => {
  const router = useRouter();

  const {setTheme} = useTheme();

  // The next user on this browser starts from the system theme
  const handleSessionEnd = () => {
    setTheme("system");

    router.replace("/sign-in");
  };

  const {isUnauthorized} = useHandleUnauthorized(handleSessionEnd);

  return {handleSessionEnd, isUnauthorized};
};

export {usePrivateLayout};
