import { cva } from "@/shared/lib/cva";
import styles from "./SoftButton.module.css";
import { type HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "teritary" | "clean" | "error";

interface SoftButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: Variant;
}

export default forwardRef(function SoftButton(
  {
    className,
    variant = "primary",
    children,
    style,
    ...props
  }: SoftButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  let bgColor = "var(--Accent)";
  let borderColor = "var(--Accent-highlight)";

  switch (variant) {
    case "secondary":
      bgColor = "var(--Primary)";
      borderColor = "var(--Primary)";
      break;
    case "teritary":
      bgColor = "white";
      borderColor = "var(--Foreground-1)";
      break;
    case "clean":
      bgColor = "white";
      borderColor = "white";
      break;
    case "error":
      bgColor = "var(--Error-light)";
      break;
  }

  return (
    <motion.button
      ref={ref}
      className={cva(
        "cursor-pointer transition-all disabled:cursor-default p-px h-8",
        styles["gradient-border"],
        styles["border-radius"],
        {
          "p-0 !border-0": ["clean", "error"].includes(variant),
        },
        className,
      )}
      style={{
        // @ts-expect-error variables
        "--bg-color": bgColor,
        "--border-color": borderColor,
        ...style,
      }}
      whileTap={{
        scale: 0.96,
      }}
      {...props}
    >
      <div
        className={cva(
          "flex h-full items-center justify-center px-3 text-white font-extrabold gap-2 text-sm transition-all",
          {
            "text-primary": ["teritary", "clean"].includes(variant),
            "text-error": variant === "error",
          },
          styles["border-radius-inside"],
        )}
      >
        {children}
      </div>
    </motion.button>
  );
});
