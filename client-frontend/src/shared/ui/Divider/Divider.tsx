import { cva } from "@/shared/lib/cva";
import { memo, type HTMLAttributes } from "react";

export default memo(function Divider({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <figure
      className={cva("w-full my-5 border-t border-foreground-1", className)}
      {...props}
    />
  );
});
