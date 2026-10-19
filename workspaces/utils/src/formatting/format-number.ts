import {defaultLocale} from "./default-locale";
import * as withShowSignOption from "./show-sign-option";
import type {ShowSignOption} from "./show-sign-option";

type ExposedNumberFormatOptions = Pick<
  Intl.NumberFormatOptions,
  "maximumFractionDigits" | "minimumFractionDigits"
>;

type NumberOptions = ExposedNumberFormatOptions & {
  fractionDigits?: number;
  showCompact?: boolean;
  showSign?: ShowSignOption;
};

type Options = NumberOptions & {
  locale?: string;
};

const {showSignOptions} = withShowSignOption;

const getNumberFormatOptions = ({
  fractionDigits,
  showCompact,
  showSign = showSignOptions.negative,
  ...exposedNumberFormatOptions
}: NumberOptions): Intl.NumberFormatOptions => ({
  ...exposedNumberFormatOptions,
  ...(fractionDigits !== undefined && {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits
  }),
  ...(showCompact && {notation: "compact"}),
  signDisplay: withShowSignOption.toIntlSignDisplay(showSign)
});

const formatNumber = (
  value: number,
  {locale = defaultLocale, ...numberOptions}: Options = {}
) =>
  new Intl.NumberFormat(locale, getNumberFormatOptions(numberOptions)).format(
    value
  );

export {formatNumber};
export type {Options as FormatNumberOptions};
