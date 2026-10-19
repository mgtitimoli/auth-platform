"use client";

import * as withHeader from "@mgtitimoli/utils/tanstack-table/header";
import type {ReactTable, RowData, TableFeatures} from "@tanstack/react-table";

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
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  width: withHeader.hasColumnSizing(header)
                    ? header.getSize()
                    : undefined
                }}
              >
                {!header.isPlaceholder && <table.FlexRender header={header} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getAllCells().map(cell => (
              <td key={cell.id}>
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
