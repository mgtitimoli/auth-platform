import type {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable
} from "kysely";

import type {UserStatus} from "./user-status";

type DatabaseDefinition = {
  sessions: SessionTable;
  userCredentials: UserCredentialTable;
  users: UserTable;
};

type SessionTable = {
  createdAt: GeneratedAlways<string>;
  // The opaque token, created by the domain
  id: ColumnType<string, string, never>;
  terminationTime: null | string;
  userId: ColumnType<string, string, never>;
};

type UserCredentialTable = {
  createdAt: GeneratedAlways<string>;
  passwordHash: string;
  updatedAt: GeneratedAlways<string>;
  userId: ColumnType<string, string, never>;
};

type UserTable = {
  createdAt: GeneratedAlways<string>;
  email: string;
  firstName: string;
  id: GeneratedAlways<string>;
  lastName: string;
  loginsCounter: ColumnType<number, number | undefined, number>;
  status: ColumnType<UserStatus, undefined | UserStatus, UserStatus>;
  updatedAt: GeneratedAlways<string>;
};

type InsertableSession = Insertable<SessionTable>;

type InsertableUser = Insertable<UserTable>;

type InsertableUserCredential = Insertable<UserCredentialTable>;

type SelectableSession = Selectable<SessionTable>;

type SelectableUser = Selectable<UserTable>;

type SelectableUserCredential = Selectable<UserCredentialTable>;

type UpdateableSession = Updateable<SessionTable>;

type UpdateableUser = Updateable<UserTable>;

type UpdateableUserCredential = Updateable<UserCredentialTable>;

export type {
  DatabaseDefinition,
  InsertableSession,
  InsertableUser,
  InsertableUserCredential,
  SelectableSession,
  SelectableUser,
  SelectableUserCredential,
  SessionTable,
  UpdateableSession,
  UpdateableUser,
  UpdateableUserCredential,
  UserCredentialTable,
  UserTable
};
