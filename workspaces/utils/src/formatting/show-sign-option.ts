type ShowSignOption = (typeof showSignOptions)[keyof typeof showSignOptions];

type IntlSignDisplay = NonNullable<Intl.NumberFormatOptions["signDisplay"]>;

const showSignOptions = {
  all: "all",
  negative: "negative"
} as const;

const intlSignDisplays = {
  [showSignOptions.all]: "exceptZero",
  [showSignOptions.negative]: "negative"
} as const satisfies Record<ShowSignOption, IntlSignDisplay>;

const toIntlSignDisplay = (showSignOption: ShowSignOption) =>
  intlSignDisplays[showSignOption];

export {showSignOptions, toIntlSignDisplay};
export type {ShowSignOption};
