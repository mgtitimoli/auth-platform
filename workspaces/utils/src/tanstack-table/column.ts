import type {
  Column,
  Column_ColumnPinning,
  Column_ColumnSizing,
  RowData,
  TableFeatures
} from "@tanstack/react-table";

// A column only has a feature's APIs when its table registers that feature
// (the type can't tell in generic code)

const hasColumnPinning = <
  TFeatures extends TableFeatures,
  TData extends RowData
>(
  column: Column<TFeatures, TData>
): column is Column_ColumnPinning & Column<TFeatures, TData> =>
  "getIsPinned" in column;

const hasColumnSizing = <
  TFeatures extends TableFeatures,
  TData extends RowData
>(
  column: Column<TFeatures, TData>
): column is Column_ColumnSizing & Column<TFeatures, TData> =>
  "getStart" in column;

export {hasColumnPinning, hasColumnSizing};
