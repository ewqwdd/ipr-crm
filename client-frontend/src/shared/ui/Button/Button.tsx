import { cva } from "@/shared/lib/cva";
import styles from "./Button.module.css";
import { motion, type HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "teritary";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: Variant;
}

export default function Button({
  className,
  variant = "primary",
  children,
  style,
  ...props
}: ButtonProps) {
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
  }

  return (
    <motion.button
      initial={{
        translateY: 0,
        boxShadow: "0px 2px 0px 0px var(--border-color)",
      }}
      whileTap={{
        translateY: 2,
        boxShadow: "0px 0px 0px 0px var(--border-color)",
        transition: {
          ease: "easeOut",
          duration: 0.15,
        },
      }}
      className={cva(
        "cursor-pointer p-px",
        styles["gradient-border"],
        styles["border-radius"],
        className,
      )}
      style={{
        // @ts-expect-error variables
        "--bg-color": bgColor,
        "--border-color": borderColor,
        ...style,
      }}
      {...props}
    >
      <div
        className={cva(
          "flex h-[52px] items-center justify-center px-4 text-white font-extrabold",
          {
            "text-primary": variant === "teritary",
          },
          styles["border-radius-inside"],
        )}
      >
        {children}
      </div>
    </motion.button>
  );
}
