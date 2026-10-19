# tanstack-table

Utilities for [TanStack Table](https://tanstack.com/table) (v9).

In generic code (a component that renders any table), the APIs a feature adds
to headers, columns or rows aren't typed, since they depend on the table's
features. The predicates in these modules check at runtime whether an object
has a feature's APIs, and narrow its type to them.

## Modules

- [header](./header.ts)
