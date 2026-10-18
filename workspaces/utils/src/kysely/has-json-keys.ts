import {sql} from "kysely";
import type {ExpressionBuilder, SqlBool} from "kysely";

import type {ColumnNameFrom} from "./types";

type Params<TExpressionBuilder extends ExpressionBuilder<any, any>> = {
  column: ColumnNameFrom<TExpressionBuilder>;
  eb: TExpressionBuilder;
  keys: string[];
};

const hasJsonKeys = <TExpressionBuilder extends ExpressionBuilder<any, any>>({
  column,
  eb,
  keys
}: Params<TExpressionBuilder>) =>
  sql<SqlBool>`${eb.ref(column)} ?| ${keys}::text[]`;

export {hasJsonKeys};
