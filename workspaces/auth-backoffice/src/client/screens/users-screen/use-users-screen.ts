import {keepPreviousData} from "@tanstack/react-query";
import {useState} from "react";

import {authApi} from "@/client/utils/auth-api";

const pageSize = 6;

const useUsersScreen = () => {
  const [page, setPage] = useState(1);

  const {data: usersResponse, isPlaceholderData} = authApi.useQuery(
    "get",
    "/users",
    {params: {query: {limit: pageSize, offset: (page - 1) * pageSize}}},
    {placeholderData: keepPreviousData}
  );

  const pageCount = Math.ceil(
    (usersResponse?.pagination.total ?? 0) / pageSize
  );

  return {
    isPlaceholderData,
    page,
    pageCount,
    setPage,
    users: usersResponse?.data
  };
};

export {useUsersScreen};
