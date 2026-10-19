"use client";

import * as styles from "./table.css";

type Props = {
  children: string;
};

// Cells cut long text with an ellipsis, so the title shows it in full
const TableCellText = ({children}: Props) => (
  <span className={styles.cellText} title={children}>
    {children}
  </span>
);

export {TableCellText};
