import {defaultLocale} from "./default-locale";

type Options = {
  locale?: string;
};

const formatRelativeTime = (
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  {locale = defaultLocale}: Options = {}
) => new Intl.RelativeTimeFormat(locale, {numeric: "auto"}).format(value, unit);

export {formatRelativeTime};
