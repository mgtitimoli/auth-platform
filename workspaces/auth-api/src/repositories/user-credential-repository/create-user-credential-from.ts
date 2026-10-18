import type {UserCredential} from "@mgtitimoli/auth-domain/domain-schema";

import type {SelectableUserCredential} from "@/database/database-schema";

const createUserCredentialFrom = (
  selectableUserCredential: SelectableUserCredential
): UserCredential => selectableUserCredential;

export {createUserCredentialFrom};
