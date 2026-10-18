import type {ExpressionBuilder} from "kysely";

type ColumnNameFrom<TExpressionBuilder extends ExpressionBuilder<any, any>> =
  TExpressionBuilder extends ExpressionBuilder<
    infer TDatabaseDefinition,
    infer TTableName
  >
    ? keyof TDatabaseDefinition[TTableName] & string
    : never;

export type {ColumnNameFrom};
