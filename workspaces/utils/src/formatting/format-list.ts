import {defaultLocale} from "./default-locale";

type Options = {
  locale?: string;
  type?: Exclude<Intl.ListFormatType, "unit">;
};

const formatList = (
  items: string[],
  {locale = defaultLocale, ...listFormatOptions}: Options = {}
) => new Intl.ListFormat(locale, listFormatOptions).format(items);

export {formatList};
