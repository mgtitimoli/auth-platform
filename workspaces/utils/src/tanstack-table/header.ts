import type {
  Header,
  Header_ColumnSizing,
  RowData,
  TableFeatures
} from "@tanstack/react-table";

// A header only has the sizing APIs when its table registers
// columnSizingFeature (the type can't tell in generic code)
const hasColumnSizing = <
  TFeatures extends TableFeatures,
  TData extends RowData
>(
  header: Header<TFeatures, TData>
): header is Header_ColumnSizing & Header<TFeatures, TData> =>
  "getSize" in header;

export {hasColumnSizing};
