import React, { type ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import Multiply from "@/shared/icons/Multiply.svg";
import { cva } from "@/shared/lib/cva";

type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  title?: ReactNode;
  loading?: boolean;
  className?: string;
};

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: "blur(8px)" },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const Modal: React.FC<ModalBaseProps> = ({
  open,
  onClose,
  children,
  ariaLabel = "Модальное окно",
  title,
  loading,
  className,
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
      className="fixed inset-0 bg-primary/40 z-50 overflow-y-auto"
      style={{ display: "grid", placeItems: "center", padding: "2rem 0" }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      <motion.div
        className={cva(
          "bg-white border border-foreground-1 rounded-[20px] p-6 flex flex-col gap-5 max-w-[25rem] w-full font-extrabold overflow-x-clip",
          { "animate-pulse pointer-events-none": !!loading },
          className,
        )}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
        transition={{ type: "spring", stiffness: 450, damping: 40 }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        style={{ margin: "auto" }}
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

export default Modal;
