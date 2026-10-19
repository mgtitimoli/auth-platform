"use client";

import type {User} from "@mgtitimoli/auth-domain/domain-schema";
import * as withUserStatus from "@mgtitimoli/auth-domain/user-status";
import type {UserStatus} from "@mgtitimoli/auth-domain/user-status";
import {formatDate, formatNumber} from "@mgtitimoli/utils/formatting";
import {
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable
} from "@tanstack/react-table";

import {Table, TableCellText} from "@/client/components/table";

import * as styles from "./users-table.css";

type Props = {
  isBusy: boolean;
  users: User[];
};

const {userStatuses} = withUserStatus;

const features = tableFeatures({columnSizingFeature});

const columnHelper = createColumnHelper<typeof features, User>();

const userStatusLabels: Record<UserStatus, string> = {
  [userStatuses.active]: "Active",
  [userStatuses.inactive]: "Inactive"
};

const columns = columnHelper.columns([
  columnHelper.accessor(user => user.firstName + " " + user.lastName, {
    cell: ({getValue}) => <TableCellText>{getValue()}</TableCellText>,
    header: "Name",
    id: "name",
    size: 220
  }),
  columnHelper.accessor("email", {
    cell: ({getValue}) => <TableCellText>{getValue()}</TableCellText>,
    header: "Email",
    size: 340
  }),
  columnHelper.accessor("status", {
    cell: ({getValue}) => (
      <span className={styles.status[getValue()]}>
        {userStatusLabels[getValue()]}
      </span>
    ),
    header: "Status",
    size: 140
  }),
  columnHelper.accessor("loginsCounter", {
    cell: ({getValue}) => (
      <TableCellText>{formatNumber(getValue())}</TableCellText>
    ),
    header: "Logins",
    size: 100
  }),
  columnHelper.accessor("createdAt", {
    cell: ({getValue}) => (
      <TableCellText>
        {formatDate(new Date(getValue()), {dateStyle: "medium"})}
      </TableCellText>
    ),
    header: "Created",
    size: 200
  })
]);

const UsersTable = ({isBusy, users}: Props) => {
  const table = useTable({
    columns,
    data: users,
    features,
    getRowId: user => user.id
  });

  return <Table isBusy={isBusy} table={table} />;
};

export {UsersTable};
