# formatting

Formatters built on `Intl`, in `en-US` unless a `locale` is given.

## Modules

- [show-sign-option](./show-sign-option.ts)

## Types

### FormatValue

#### Description

Function that formats a value as a string.

## Functions

### formatCurrency

#### Description

Function to format an amount of money (USD unless a `currency` is given), with
at most 2 fraction digits by default. `showAccounting` wraps negative amounts in
parentheses and `showCompact` abbreviates them (`$1.2K`).

#### Example

```ts
import {formatCurrency} from "@mgtitimoli/utils/formatting";

formatCurrency(1234.5); // $1,234.5
```

### formatDate

#### Description

Function to format a date, taking any `Intl.DateTimeFormat` option.

#### Example

```ts
import {formatDate} from "@mgtitimoli/utils/formatting";

formatDate(new Date("2026-10-19T12:00:00Z"), {dateStyle: "medium"}); // Oct 19, 2026
```

### formatList

#### Description

Function to format a list of strings as a sentence (`type` is `conjunction` by
default, or `disjunction`).

#### Example

```ts
import {formatList} from "@mgtitimoli/utils/formatting";

formatList(["red", "green", "blue"]); // red, green, and blue
```

### formatNumber

#### Description

Function to format a number. `fractionDigits` sets both the minimum and the
maximum fraction digits, `showCompact` abbreviates it (`1.2K`), and `showSign`
(`all` or `negative`, the default) decides which signs are shown.

#### Example

```ts
import {formatNumber} from "@mgtitimoli/utils/formatting";

formatNumber(1234.567, {fractionDigits: 1}); // 1,234.6
```

### formatOptional

#### Description

Function that returns a formatter showing the given default value for `null`
and `undefined`, and formatting any other value (with `String` unless a
formatter is given).

#### Example

```ts
import {formatOptional} from "@mgtitimoli/utils/formatting";

const formatOptionalAmount = formatOptional("N/A");

formatOptionalAmount(undefined); // N/A
```

### formatOptionalCsvValue

#### Description

`formatOptional` with an empty string, for CSV cells.

### formatOptionalValue

#### Description

`formatOptional` with an em dash (`—`), for UI values.

#### Example

```ts
import {formatNumber, formatOptionalValue} from "@mgtitimoli/utils/formatting";

formatOptionalValue(null, formatNumber); // —
```

### formatOrdinalNumber

#### Description

Function to format a number as an English ordinal.

#### Example

```ts
import {formatOrdinalNumber} from "@mgtitimoli/utils/formatting";

formatOrdinalNumber(22); // 22nd
```

### formatPercentage

#### Description

Function to format a percentage (a fraction of 100), taking `formatRatio`'s
options.

#### Example

```ts
import {formatPercentage} from "@mgtitimoli/utils/formatting";

formatPercentage(25); // 25%
```

### formatRatio

#### Description

Function to format a ratio (a fraction of 1) as a percentage. `showSign` (`all`
or `negative`, the default) decides which signs are shown.

#### Example

```ts
import {formatRatio} from "@mgtitimoli/utils/formatting";

formatRatio(0.25); // 25%
```

### formatRelativeTime

#### Description

Function to format an amount of time relative to now, using words when
possible (`yesterday` instead of `1 day ago`).

#### Example

```ts
import {formatRelativeTime} from "@mgtitimoli/utils/formatting";

formatRelativeTime(-1, "day"); // yesterday
```
