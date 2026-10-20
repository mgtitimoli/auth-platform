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
  display: "flex",
  flexDirection: "column",
  gap: space.md,
  left: "50%",
  padding: space.lg,
  position: "fixed",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(26rem, calc(100vw - 2 * " + space.md + "))"
});

const title = style({
  fontSize: fontSizes.lg,
  margin: 0
});

const description = style({
  color: colors.mutedForeground,
  fontSize: fontSizes.sm,
  margin: 0
});

const error = style({
  color: colors.danger,
  fontSize: fontSizes.sm,
  margin: 0
});

const actions = style({
  display: "flex",
  gap: space.sm,
  justifyContent: "flex-end",
  paddingTop: space.sm
});

export {actions, backdrop, description, error, popup, title};
