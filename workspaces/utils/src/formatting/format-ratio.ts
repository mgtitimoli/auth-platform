import {defaultLocale} from "./default-locale";
import * as withShowSignOption from "./show-sign-option";
import type {ShowSignOption} from "./show-sign-option";

type ExposedNumberFormatOptions = Pick<
  Intl.NumberFormatOptions,
  "maximumFractionDigits" | "minimumFractionDigits"
>;

type NumberOptions = ExposedNumberFormatOptions & {
  showSign?: ShowSignOption;
};

type Options = NumberOptions & {
  locale?: string;
};

const {showSignOptions} = withShowSignOption;

const getNumberFormatOptions = ({
  showSign = showSignOptions.negative,
  ...exposedNumberFormatOptions
}: NumberOptions): Intl.NumberFormatOptions => ({
  ...exposedNumberFormatOptions,
  signDisplay: withShowSignOption.toIntlSignDisplay(showSign),
  style: "percent"
});

// A ratio is a fraction of 1 (0.25 → 25%)
const formatRatio = (
  ratio: number,
  {locale = defaultLocale, ...numberOptions}: Options = {}
) =>
  new Intl.NumberFormat(locale, getNumberFormatOptions(numberOptions)).format(
    ratio
  );

export {formatRatio};
export type {Options as FormatRatioOptions};
