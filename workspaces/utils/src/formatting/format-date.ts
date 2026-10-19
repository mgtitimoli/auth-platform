import {defaultLocale} from "./default-locale";

type Options = Intl.DateTimeFormatOptions & {
  locale?: string;
};

const formatDate = (
  date: Date,
  {locale = defaultLocale, ...dateTimeFormatOptions}: Options = {}
) => new Intl.DateTimeFormat(locale, dateTimeFormatOptions).format(date);

export {formatDate};
