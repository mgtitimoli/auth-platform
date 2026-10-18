import {sql} from "kysely";
import type {ExpressionBuilder} from "kysely";

import type {JsonUpdates} from "./json-updates";
import type {ColumnNameFrom} from "./types";

type Params<TExpressionBuilder extends ExpressionBuilder<any, any>> =
  Partial<JsonUpdates> & {
    column: ColumnNameFrom<TExpressionBuilder>;
    eb: TExpressionBuilder;
  };

const updateJson = <TExpressionBuilder extends ExpressionBuilder<any, any>>({
  column,
  dataToMerge,
  eb,
  keysToRemove
}: Params<TExpressionBuilder>) => {
  const hasDataToMerge = dataToMerge && Object.keys(dataToMerge).length > 0;

  const hasKeysToRemove = keysToRemove && keysToRemove.length > 0;

  if (!hasDataToMerge && !hasKeysToRemove) {
    return undefined;
  }

  let expression = sql`COALESCE(${eb.ref(column)}, '{}'::jsonb)`;

  if (hasKeysToRemove) {
    expression = sql`${expression} - ${keysToRemove}::text[]`;
  }

  if (hasDataToMerge) {
    expression = sql`${expression} || ${JSON.stringify(dataToMerge)}::jsonb`;
  }

  return {
    [column]: expression
  };
};

export {updateJson};
