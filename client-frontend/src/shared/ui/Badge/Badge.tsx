import { cva } from "@/shared/lib/cva";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "teritary"
  | "primary-light"
  | "success"
  | "error"
  | "warning"
  | "warning-alt"
  | "error-alt"
  | "success-alt";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-primary text-white",
  teritary: "bg-white text-primary border border-foreground-1",
  "primary-light": "bg-accent-light text-accent",
  success: "bg-success text-white",
  error: "bg-error text-white",
  warning: "bg-warning text-white",
  "warning-alt": "bg-waning-alt text-primary",
  "error-alt": "bg-error-alt text-white",
  "success-alt": "bg-success-alt text-primary",
};

export default function Badge({
  children,
  className,
  variant = "primary",
  icon,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cva(
        "h-6 flex items-center text-sm font-extrabold gap-2 px-2 rounded-3xl",
        {
          [badgeVariants[variant]]: true,
          "pl-1": !!icon,
        },
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  );
}
