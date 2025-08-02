import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "@/shared/lib/cva";

type DropdownPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "top-center";

interface DropdownProps {
  button: React.ReactNode | ((isActive: boolean) => React.ReactNode);
  children: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  position?: DropdownPosition;
  offset?: number;
  disabled?: boolean;
}

const getPositionStyles = (position: DropdownPosition, offset: number) => {
  const styles: React.CSSProperties = {};

  switch (position) {
    case "bottom-left":
      styles.top = `calc(100% + ${offset}px)`;
      styles.left = 0;
      break;
    case "bottom-right":
      styles.top = `calc(100% + ${offset}px)`;
      styles.right = 0;
      break;
    case "bottom-center":
      styles.top = `calc(100% + ${offset}px)`;
      styles.left = "50%";
      styles.transform = "translateX(-50%)";
      break;
    case "top-left":
      styles.bottom = `calc(100% + ${offset}px)`;
      styles.left = 0;
      break;
    case "top-right":
      styles.bottom = `calc(100% + ${offset}px)`;
      styles.right = 0;
      break;
    case "top-center":
      styles.bottom = `calc(100% + ${offset}px)`;
      styles.left = "50%";
      styles.transform = "translateX(-50%)";
      break;
  }

  return styles;
};

const getAnimationDirection = (position: DropdownPosition) => {
  if (position.startsWith("top")) {
    return { y: 8 };
  }
  return { y: -8 };
};

export default function Dropdown({
  button,
  children,
  className,
  dropdownClassName,
  position = "bottom-left",
  offset = 8,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const positionStyles = getPositionStyles(position, offset);
  const animationDirection = getAnimationDirection(position);

  // Рендерим button в зависимости от типа
  const renderButton = () => {
    if (typeof button === "function") {
      return button(open);
    }
    return button;
  };

  return (
    <div className={cva("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
      >
        {renderButton()}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
              ...animationDirection,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              ...animationDirection,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={cva(
              "absolute min-w-[160px] rounded-lg bg-white z-50 p-6",
              dropdownClassName,
            )}
            style={positionStyles}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
