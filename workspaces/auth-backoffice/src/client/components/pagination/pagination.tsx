"use client";

import {Button} from "@/client/components/button";

import * as styles from "./pagination.css";

type Props = {
  isDisabled?: boolean;
  onPageChange: (page: number) => unknown;
  page: number;
  pageCount: number;
};

const Pagination = ({
  isDisabled = false,
  onPageChange,
  page,
  pageCount
}: Props) => (
  <nav aria-label="Pagination" className={styles.root}>
    <Button
      disabled={isDisabled || page <= 1}
      onClick={() => onPageChange(page - 1)}
    >
      Previous
    </Button>
    <span className={styles.status}>{"Page " + page + " of " + pageCount}</span>
    <Button
      disabled={isDisabled || page >= pageCount}
      onClick={() => onPageChange(page + 1)}
    >
      Next
    </Button>
  </nav>
);

export {Pagination};
