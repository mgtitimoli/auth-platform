import {Toast} from "@base-ui/react/toast";
import type {NewUserInput, User} from "@mgtitimoli/auth-domain/domain-schema";
import {keepPreviousData, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

import {authApi} from "@/client/utils/auth-api";

const pageSize = 6;

const useUsersScreen = () => {
  const queryClient = useQueryClient();

  const toastManager = Toast.useToastManager();

  const [page, setPage] = useState(1);

  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);

  const [editedUser, setEditedUser] = useState<User>();

  const {data: usersResponse, isPlaceholderData} = authApi.useQuery(
    "get",
    "/users",
    {params: {query: {limit: pageSize, offset: (page - 1) * pageSize}}},
    {placeholderData: keepPreviousData}
  );

  const pageCount = Math.ceil(
    (usersResponse?.pagination.total ?? 0) / pageSize
  );

  const handleCreate = async ({firstName, lastName}: NewUserInput) => {
    setIsCreateUserDialogOpen(false);

    toastManager.add({title: firstName + " " + lastName + " was created"});

    // Every page: the total, and so the page count, changed
    await queryClient.invalidateQueries({queryKey: ["get", "/users"]});
  };

  const handleEdit = async ({firstName, lastName}: User) => {
    setEditedUser(undefined);

    toastManager.add({title: firstName + " " + lastName + " was updated"});

    // The account menu shows the signed-in user, who may be the edited one
    await Promise.all([
      queryClient.invalidateQueries({queryKey: ["get", "/users"]}),
      queryClient.invalidateQueries({queryKey: ["get", "/users/me"]})
    ]);
  };

  const handleEditUserDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditedUser(undefined);
    }
  };

  return {
    editedUser,
    handleCreate,
    handleEdit,
    handleEditUserDialogOpenChange,
    isCreateUserDialogOpen,
    isPlaceholderData,
    page,
    pageCount,
    setEditedUser,
    setIsCreateUserDialogOpen,
    setPage,
    users: usersResponse?.data
  };
};

export {useUsersScreen};
