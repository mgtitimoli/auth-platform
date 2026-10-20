import {globalStyle, style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, space} = applicationThemeVars;

const root = style({
  // Keeps the pinned columns' z-index inside the table, below dialogs and
  // menus
  isolation: "isolate",
  // Scrolls horizontally when the columns don't fit, instead of the page
  overflowX: "auto"
});

const table = style({
  borderCollapse: "collapse",
  fontSize: fontSizes.sm,
  selectors: {
    "&[aria-busy='true']": {
      opacity: 0.5
    }
  },
  // Widths come from the columns, not from the rows on screen, so they don't
  // shift between pages
  tableLayout: "fixed",
  transition: "opacity 150ms",
  width: "100%"
});

globalStyle(table + " th, " + table + " td", {
  borderBottom: "1px solid " + colors.border,
  padding: space.sm + " " + space.md,
  textAlign: "left"
});

globalStyle(table + " th", {
  color: colors.mutedForeground,
  fontWeight: 500
});

const pinned = style({
  background: colors.background,
  // An edge that sets it apart from the columns scrolling under it: a shadow,
  // since collapsed borders belong to the table and don't move with the cell
  boxShadow: "inset -1px 0 0 " + colors.border,
  position: "sticky",
  zIndex: 1
});

const cellText = style({
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

export {cellText, pinned, root, table};
