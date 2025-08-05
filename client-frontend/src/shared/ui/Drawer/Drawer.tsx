import React, { type ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import Multiply from "@/shared/icons/Multiply.svg";
import { cva } from "@/shared/lib/cva";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  title?: ReactNode;
  loading?: boolean;
  className?: string;
  closeOnOutside?: boolean;
};

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(8px)" },
};

const drawerVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0 },
};

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  ariaLabel = "Нижний drawer",
  title,
  loading,
  className,
  closeOnOutside = true,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <motion.div
      className="fixed inset-0 bg-primary/40 z-50 overflow-y-auto w-screen max-w-full"
      style={{ display: "grid", placeItems: "end" }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={closeOnOutside ? onClose : undefined}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      <motion.div
        className={cva(
          "bg-white border border-foreground-1 rounded-t-[20px] p-5 flex flex-col gap-5 font-extrabold w-screen overflow-x-clip",
          { "animate-pulse pointer-events-none": !!loading },
          className,
        )}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={drawerVariants}
        transition={{ type: "spring", stiffness: 450, damping: 40 }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex items-center font-extrabold">
          <h2 className="truncate flex-1">{title}</h2>
          <button onClick={onClose} className="cursor-pointer">
            <Multiply className="text-teritary size-6 min-w-6" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Drawer;
