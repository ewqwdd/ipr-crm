import { cva } from "@/shared/lib/cva";
import type { ComponentPropsWithRef, HTMLAttributes } from "react";

export default function ShadowCard({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cva(
        "bg-white font-extrabold border rounded-t-[23px] rounded-b-[21px] border-foreground-1 p-4  shadow-[0px_2px_0px_0px_var(--Foreground-1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
