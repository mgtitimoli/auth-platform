type MenuItemVariant = (typeof menuItemVariants)[keyof typeof menuItemVariants];

const menuItemVariants = {
  danger: "danger",
  default: "default"
} as const;

export {menuItemVariants};
export type {MenuItemVariant};
