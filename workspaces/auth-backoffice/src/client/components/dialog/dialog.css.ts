import {style} from "@vanilla-extract/css";

import {applicationThemeVars} from "@/client/components/application/application-theme.css";

const {colors, fontSizes, radii, space} = applicationThemeVars;

const backdrop = style({
  background: "rgb(0 0 0 / 0.4)",
  inset: 0,
  position: "fixed"
});

const popup = style({
  background: colors.background,
  border: "1px solid " + colors.border,
  borderRadius: radii.md,
  boxShadow: "0 8px 32px rgb(0 0 0 / 0.2)",
  color: colors.foreground,
  left: "50%",
  maxHeight: "calc(100dvh - 2 * " + space.lg + ")",
  overflowY: "auto",
  padding: space.lg,
  position: "fixed",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(28rem, calc(100vw - 2 * " + space.md + "))"
});

const title = style({
  fontSize: fontSizes.lg,
  margin: 0,
  marginBottom: space.md,
  // Leaves room for the close button
  paddingRight: space.xl
});

const close = style({
  background: "none",
  border: "none",
  borderRadius: radii.md,
  color: colors.mutedForeground,
  cursor: "pointer",
  display: "inline-flex",
  padding: space.sm,
  position: "absolute",
  right: space.md,
  top: space.md
});

export {backdrop, close, popup, title};
