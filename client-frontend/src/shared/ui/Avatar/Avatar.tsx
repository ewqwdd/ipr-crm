import { cva } from "@/shared/lib/cva";
import { memo, type ImgHTMLAttributes } from "react";
import AvatarIcon from "@/shared/icons/Avatar.svg";

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
}

export default memo(function Avatar({ src, ...props }: AvatarProps) {
  if (!src)
    return (
      <AvatarIcon
        className={cva(
          "rounded-full size-8 overflow-clip object-cover",
          props.className,
        )}
      />
    );

  return (
    <img
      src={src}
      {...props}
      className={cva(
        "rounded-full size-8 overflow-clip object-cover",
        props.className,
      )}
    />
  );
});
