import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Down from "@/shared/icons/Down.svg";
import { cva } from "@/shared/lib/cva";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: number | string;
  buttonClassName?: string;
}

export default function Select({
  options = [],
  value,
  onChange,
  placeholder = "Выберите...",
  className = "",
  buttonClassName,
  width,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      className={cva("relative select-none", className)}
      style={{ width }}
    >
      <button
        className={cva(
          "flex items-center w-full px-5 py-2 bg-white rounded-3xl border border-foreground-1 text-sm font-extrabold focus:outline-none",
          buttonClassName,
        )}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {selected ? (
          <span className="pr-1">{selected.label}</span>
        ) : (
          <span className="text-gray-400 pr-1">{placeholder}</span>
        )}
        <Down
          className={cva("size-3 ml-auto", {
            "rotate-180": open,
          })}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-foreground-1 z-10 overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`px-3 py-1 cursor-pointer text-sm hover:bg-foreground-1 truncate ${
                  value === opt.value ? "font-bold text-accent" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
