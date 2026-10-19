import {
  assignVars,
  createThemeContract,
  globalStyle
} from "@vanilla-extract/css";

const applicationThemeVars = createThemeContract({
  colors: {
    background: null,
    border: null,
    foreground: null,
    mutedForeground: null
  },
  fontFamilies: {
    body: null
  },
  fontSizes: {
    lg: null,
    md: null,
    sm: null,
    xl: null
  },
  radii: {
    md: null
  },
  space: {
    lg: null,
    md: null,
    sm: null,
    xl: null
  }
});

const sharedValues = {
  fontFamilies: {
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  },
  fontSizes: {
    lg: "1.25rem",
    md: "1rem",
    sm: "0.875rem",
    xl: "1.875rem"
  },
  radii: {
    md: "0.5rem"
  },
  space: {
    lg: "1.5rem",
    md: "1rem",
    sm: "0.5rem",
    xl: "2.5rem"
  }
};

const lightValues = {
  ...sharedValues,
  colors: {
    background: "rgb(255 255 255)",
    border: "rgb(229 229 229)",
    foreground: "rgb(10 10 10)",
    mutedForeground: "rgb(115 115 115)"
  }
};

const darkValues = {
  ...sharedValues,
  colors: {
    background: "rgb(10 10 10)",
    border: "rgb(38 38 38)",
    foreground: "rgb(250 250 250)",
    mutedForeground: "rgb(163 163 163)"
  }
};

const darkColorSchemeQuery = "(prefers-color-scheme: dark)";

globalStyle(":root", {
  colorScheme: "light",
  vars: assignVars(applicationThemeVars, lightValues)
});

// The system theme, unless light was chosen explicitly
globalStyle(":root:not([data-theme='light'])", {
  "@media": {
    [darkColorSchemeQuery]: {
      colorScheme: "dark",
      vars: assignVars(applicationThemeVars, darkValues)
    }
  }
});

globalStyle(":root[data-theme='dark']", {
  colorScheme: "dark",
  vars: assignVars(applicationThemeVars, darkValues)
});

export {applicationThemeVars};
