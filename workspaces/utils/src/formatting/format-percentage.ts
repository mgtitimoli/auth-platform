import {formatRatio} from "./format-ratio";
import type {FormatRatioOptions} from "./format-ratio";

const formatPercentage = (percentage: number, options?: FormatRatioOptions) =>
  formatRatio(percentage / 100, options);

export {formatPercentage};
