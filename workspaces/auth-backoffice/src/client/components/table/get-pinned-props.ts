import * as withColumn from "@mgtitimoli/utils/tanstack-table/column";
import type {Column, RowData, TableFeatures} from "@tanstack/react-table";
import type {CSSProperties} from "react";

import * as styles from "./table.css";

type PinnedProps = {
  className?: string;
  style?: CSSProperties;
};

const getPinnedProps = <TFeatures extends TableFeatures, TData extends RowData>(
  column: Column<TFeatures, TData>
): PinnedProps => {
  if (
    !withColumn.hasColumnPinning(column) ||
    column.getIsPinned() !== "start"
  ) {
    return {};
  }

  return {
    className: styles.pinned,
    style: {
      insetInlineStart: withColumn.hasColumnSizing(column)
        ? column.getStart("start")
        : 0
    }
  };
};

export {getPinnedProps};
