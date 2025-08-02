import { cva } from "@/shared/lib/cva";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cva(
        "p-6 rounded-[20px] font-extrabold border border-foreground-1 bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
