"use client";

import type {NewUserInput} from "@mgtitimoli/auth-domain/domain-schema";

import {Dialog} from "@/client/components/dialog";

import {CreateUserForm} from "./create-user-form";

type Props = {
  isOpen: boolean;
  onCreate: (input: NewUserInput) => unknown;
  onOpenChange: (isOpen: boolean) => unknown;
};

const CreateUserDialog = ({isOpen, onCreate, onOpenChange}: Props) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange} title="Create user">
    <CreateUserForm onCreate={onCreate} />
  </Dialog>
);

export {CreateUserDialog};
