# Auth Backoffice Workspace

Back office to sign up, sign in and manage users: Next.js 16 with the App
Router, talking directly to `auth-api` from the browser.

Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js
code: Next 16's APIs and conventions differ from earlier versions.

## Layout

```
src/
├── app/            # routing only
├── client/
│   ├── components/ # shared components; application/ is the app shell
│   ├── screens/    # one folder per screen
│   └── utils/      # utilities
└── proxy.ts        # redirects by session cookie
```

- `src/app` only has routing files: each `page.tsx` is a one-line re-export of
  a screen (`export {SignUpScreen as default} from "@/client/screens/sign-up-screen";`),
  and `layout.tsx` re-exports the application layout. Pages are grouped in the
  `(public)` and `(private)` route groups, which don't appear in the URL; each
  group's `layout.tsx` re-exports its layout component (`public-layout`, …), so
  what its pages share lives in one place.
- Server logic (route handlers under `app/api`) goes in a sibling `src/server`,
  re-exported from `app` the same way pages re-export screens.
- `src/client/components/application/` is the app shell:
  `application-layout.tsx` is the root layout (a server component: `metadata`,
  `<html>`, `<body>`) and `application.tsx` is its client part (providers).
- `src/client/screens/<name>-screen/` holds a screen, its hook and its own
  components, each in its own folder (`sign-in-screen/sign-in-form/`).
- `src/client/components/<name>/` holds a shared component (`<name>.tsx`,
  `<name>.css.ts` and an `index.ts`).
- A component or util lives next to its only user; once several use it, it
  moves to the `components/` or `utils/` folder of their closest common parent.

## Rendering

No Server Components or Server Actions: screens and components start with
`"use client"`. The only server component is the application layout.

## Components

- Components are mostly markup: logic that is more than trivial, or that is
  likely to grow, lives in a sibling `use-<name>.ts` hook.
- Components report what happened through `on<Event>` callbacks and never
  decide what comes next (navigating, closing a dialog): their container does.
  Callback props are always named as event handlers, never as actions
  (`onSubmit`, not `submit`), even when the container does the work in the
  handler and the component awaits it.
- Interactive components wrap Base UI, styled through `className` and its
  `data-*` attributes.
- A component wrapping another names the wrapped one's props
  `<Component>Props` (`ComponentProps<typeof Component>`) and what it passes
  through `Exposed<Component>Props` (`Omit<…>` of what it controls itself):
  `type Props = ExposedFieldControlProps & {label: string};`.
- Tables are [TanStack Table](https://tanstack.com/table) instances (headless)
  rendered by the shared `Table` component: a screen registers the features it
  needs, declares its columns with a column helper at module scope, and passes
  `useTable`'s result to `Table`. Cells reach the screen's handlers through the
  table's `meta` (`useTable({meta})`, typed with
  `tableFeatures({tableMeta: metaHelper<…>()})`), so the columns stay static.
  `Table` renders any table, so it uses a
  feature's APIs only after checking the table registers it (the predicates in
  `@mgtitimoli/utils/tanstack-table`): column sizes, and columns pinned at the
  start, which stay visible while the table scrolls.
- Dialogs are controlled by their screen (`isOpen` and `onOpenChange`): the
  screen opens them, and closes them when their content reports it's done
  (`onCreate`). Irreversible actions confirm through `AlertDialog`.
- Toasts confirm what changed somewhere else on the screen: screens add them
  with Base UI's `Toast.useToastManager()`, and the application renders them
  (`ToastProvider`).
- Paginated lists keep the page in component state and show the previous page
  while the next one loads (TanStack Query's `keepPreviousData`), with the
  list marked busy and the pagination disabled meanwhile.

## Forms

- `react-hook-form` with the zod resolver, validating against the domain
  schemas (extended only with what the form adds). Forms set `noValidate`, so
  zod is the only validator.
- Forms render through the shared `Form` component, which owns what must be
  the same everywhere (`noValidate`, disabling while busy, the form-level error
  above the submit button), so each form only lists its fields.
- A form owns its request, and maps API errors that belong to a field onto it
  (`AuthApiResponseError` and its status); any other failure goes to the form's
  `root` error. A form shared by flows with different requests (the
  `NewUserForm`) can't own one: each flow wraps it in its own form
  (`SignUpForm`), which owns the request and passes it as the shared form's
  `onSubmit`; the shared form awaits it and maps a rejection the same way.
- Field components take the error (and an optional description) as strings, so
  they don't depend on `react-hook-form`; a `SelectField` is driven through
  `Controller`.
- Forms for partial updates send only what changed (react-hook-form's
  `dirtyFields`) and keep their submit disabled until something does, so a
  save never overwrites another admin's change to other fields.
- Fields the API would reject are disabled with a description saying why,
  rather than left to fail on submit.
- A form is disabled while its request is pending or while its container says
  so (an `isDisabled` prop): `router.push` returns nothing to await, so a
  screen that navigates after success wraps it in `useTransition`.

## API

`src/client/utils/auth-api/` holds the module-level clients (from
`@mgtitimoli/auth-api-tools`): `authApi` for hooks
(`authApi.useMutation("post", "/auth/sign-up")`) and `authApiClient` for plain
calls. The API's URL comes from `NEXT_PUBLIC_AUTH_API_URL`, inlined at build
time (`.env.local` locally).

- `proxy.ts` only sees whether the session cookie exists. The private layout
  also uses `useHandleUnauthorized(onUnauthorized)`, which runs when the API
  rejects the session (the API's 401 removes the dead cookie, so the proxy
  lets them through). A session ends the same way whether the user logs out or
  the API rejects it: the private layout handles both with one callback.
- Queries don't retry client errors (4xx): they fail the same way again.
- Components call `authApi.useQuery` / `useMutation` directly, without a hook
  per endpoint: the query cache already dedupes and shares the data, so a
  wrapper would only be an indirection. Session flows that do more than one
  call are hooks with callbacks (`useSignOut(onSignOut)`), and whatever ends a session clears
  the query cache, so the next user never sees the previous one's data.

## Styling

- Styles are vanilla-extract: each component or screen has a sibling
  `<name>.css.ts`, imported as `import * as styles from "./<name>.css";`.
- Use the theme's variables (`applicationThemeVars` from
  `@/client/components/application/application-theme.css`), never literal
  colors or sizes: they switch between the light and dark themes through CSS.
- The theme choice comes from `@wrksz/themes` (`useTheme()` from
  `@wrksz/themes/client`); its provider, in the application layout, sets
  `data-theme`, which the theme's CSS reads. Whatever ends a session sets it
  back to `system`.
- Theme colors use `rgb(r g b)`, with `/ alpha` for transparency
  (`rgb(0 0 0 / 0.5)`): readable channels, one notation for everything.

## Testing

- e2e tests live in `e2e/` (`*.test.ts`), with Playwright against the built
  backoffice. Run them from the root with `yarn test-e2e`, which also starts
  auth-api's test environment (run `yarn auth-backoffice:run prepare-e2e`
  once first). The backoffice's own `test-e2e` expects an API at
  `NEXT_PUBLIC_AUTH_API_URL`.
- Tests never depend on each other's data: each one signs up with a unique
  email. Helpers shared by several test files live in `e2e/utils/`.
- Set `colorScheme` in a test (`test.use({colorScheme: "dark"})`) when the
  system theme matters, and check which theme applies through the computed
  `color-scheme` (`getColorScheme`), not through color values.
- Test our code, not libraries': e.g. the account menu's theme choice and
  sign-out's reset, but not that the theme library persists the choice.

## Type Checking

`next-env.d.ts` and `.next/types` are generated by Next (and gitignored), so
`check-types:all` runs `next typegen` before `tsc`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
