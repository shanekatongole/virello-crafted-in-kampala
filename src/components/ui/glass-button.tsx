import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "lg-btn--primary",
  secondary: "lg-btn--secondary",
  ghost: "lg-btn--ghost",
};

const sizeClass: Record<Size, string> = {
  sm: "lg-btn--sm",
  md: "",
  lg: "lg-btn--lg",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function GlassButton({
  variant = "secondary",
  size = "md",
  block,
  children,
  className = "",
  ...props
}: ButtonProps | LinkProps) {
  const classes = [
    "lg-btn",
    variantClass[variant],
    sizeClass[size],
    block ? "lg-btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
