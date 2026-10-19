// The suffixes are English, so the plural rules are too
const pluralRules = new Intl.PluralRules("en-US", {type: "ordinal"});

const suffixes = {
  few: "rd",
  many: "th",
  one: "st",
  other: "th",
  two: "nd",
  zero: "th"
} as const satisfies Record<Intl.LDMLPluralRule, string>;

const formatOrdinalNumber = (value: number) =>
  value + suffixes[pluralRules.select(value)];

export {formatOrdinalNumber};
