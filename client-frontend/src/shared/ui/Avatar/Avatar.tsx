import { cva } from "@/shared/lib/cva";
import type { ImgHTMLAttributes, HTMLAttributes } from "react";

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
}

export default function Avatar({ src, ...props }: AvatarProps) {
  return src ? (
    <img
      src={src}
      {...props}
      className={cva(
        "bg-foreground-1 rounded-full size-8 overflow-clip object-cover",
        props.className,
      )}
    />
  ) : (
    <div
      {...(props as HTMLAttributes<HTMLDivElement>)}
      className={cva(
        "bg-foreground-1 rounded-full size-8 overflow-clip",
        props.className,
      )}
    />
  );
}
