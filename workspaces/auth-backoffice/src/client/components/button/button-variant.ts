type ButtonVariant = (typeof buttonVariants)[keyof typeof buttonVariants];

const buttonVariants = {
  danger: "danger",
  primary: "primary",
  secondary: "secondary"
} as const;

export {buttonVariants};
export type {ButtonVariant};
