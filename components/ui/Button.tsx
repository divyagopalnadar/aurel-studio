import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-glow hover:bg-brand-soft hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_-16px_rgba(79,70,229,0.5)]",
  secondary:
    "bg-fg/[0.06] text-fg ring-1 ring-inset ring-edge hover:bg-fg/[0.11]",
  ghost: "text-fg/70 hover:text-fg hover:bg-fg/[0.05]",
  outline:
    "bg-transparent text-fg ring-1 ring-inset ring-edge-strong hover:bg-fg/[0.05]",
  danger: "text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[15px] gap-2.5",
  icon: "size-10",
};

const baseClass =
  "relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & { href?: string }
>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    asChild = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    baseClass,
    variantClass[variant],
    sizeClass[size],
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement<{ className?: string }>,
      { className: cn(classes, (children.props as { className?: string }).className) }
    );
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});
Button.displayName = "Button";
