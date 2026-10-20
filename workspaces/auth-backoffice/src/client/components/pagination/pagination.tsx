"use client";

import {ChevronLeft, ChevronRight} from "lucide-react";

import {IconButton} from "@/client/components/icon-button";

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
    <IconButton
      aria-label="Previous page"
      disabled={isDisabled || page <= 1}
      onClick={() => onPageChange(page - 1)}
    >
      <ChevronLeft size={16} />
    </IconButton>
    <span className={styles.status}>{"Page " + page + " of " + pageCount}</span>
    <IconButton
      aria-label="Next page"
      disabled={isDisabled || page >= pageCount}
      onClick={() => onPageChange(page + 1)}
    >
      <ChevronRight size={16} />
    </IconButton>
  </nav>
);

export {Pagination};
