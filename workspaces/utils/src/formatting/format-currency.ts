import {defaultLocale} from "./default-locale";

type ExposedNumberFormatOptions = Pick<
  Intl.NumberFormatOptions,
  "currency" | "maximumFractionDigits" | "minimumFractionDigits"
>;

type NumberOptions = ExposedNumberFormatOptions & {
  showAccounting?: boolean;
  showCompact?: boolean;
};

type Options = NumberOptions & {
  locale?: string;
};

const getNumberFormatOptions = ({
  currency = "USD",
  maximumFractionDigits = 2,
  minimumFractionDigits = 0,
  showAccounting,
  showCompact
}: NumberOptions): Intl.NumberFormatOptions => ({
  currency,
  currencySign: showAccounting ? "accounting" : "standard",
  maximumFractionDigits,
  minimumFractionDigits,
  ...(showCompact && {notation: "compact"}),
  style: "currency"
});

const formatCurrency = (
  amount: number,
  {locale = defaultLocale, ...numberOptions}: Options = {}
) =>
  new Intl.NumberFormat(locale, getNumberFormatOptions(numberOptions)).format(
    amount
  );

export {formatCurrency};
