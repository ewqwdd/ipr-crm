import { cva } from "@/shared/lib/cva";
import type { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  size?: "lg" | "xl";
}

export default function Title({
  title,
  subtitle,
  description,
  className,
  size = "lg",
  ...props
}: TitleProps) {
  return (
    <div className={cva("flex flex-col", className)} {...props}>
      {subtitle && <span className="font-extrabold">{subtitle}</span>}
      {title && (
        <h1
          className={cva("text-lg font-extrabold", {
            "text-3xl": size === "xl",
          })}
        >
          {title}
        </h1>
      )}
      {description && (
        <span className="text-sm text-secondary font-extrabold mt-1">
          {description}
        </span>
      )}
    </div>
  );
}
