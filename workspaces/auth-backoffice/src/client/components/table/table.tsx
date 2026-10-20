"use client";

import * as withHeader from "@mgtitimoli/utils/tanstack-table/header";
import type {ReactTable, RowData, TableFeatures} from "@tanstack/react-table";

import {getPinnedProps} from "./get-pinned-props";
import * as styles from "./table.css";

type Props<TFeatures extends TableFeatures, TData extends RowData> = {
  isBusy?: boolean;
  table: ReactTable<TFeatures, TData>;
};

const Table = <TFeatures extends TableFeatures, TData extends RowData>({
  isBusy = false,
  table
}: Props<TFeatures, TData>) => (
  <div className={styles.root}>
    <table aria-busy={isBusy} className={styles.table}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              const pinnedProps = getPinnedProps(header.column);

              return (
                <th
                  className={pinnedProps.className}
                  key={header.id}
                  style={{
                    ...pinnedProps.style,
                    width: withHeader.hasColumnSizing(header)
                      ? header.getSize()
                      : undefined
                  }}
                >
                  {!header.isPlaceholder && (
                    <table.FlexRender header={header} />
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getAllCells().map(cell => (
              <td key={cell.id} {...getPinnedProps(cell.column)}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export {Table};
