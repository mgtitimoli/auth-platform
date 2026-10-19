import {isDefined} from "@/validation";

import type {FormatValue} from "./types";

const formatOptional =
  (defaultValue: string) =>
  <TOptionalValue>(
    optionalValue: TOptionalValue,
    formatValue: FormatValue<NonNullable<TOptionalValue>> = String
  ) =>
    isDefined(optionalValue) ? formatValue(optionalValue) : defaultValue;

export {formatOptional};
