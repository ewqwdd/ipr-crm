import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "@/shared/lib/cva";
import ArrowDown from "@/shared/icons/ArrowDown.svg";

type Option = { value: string; label: string };

interface SearchSelectProps {
  value?: string;
  onChange: (value: Option | undefined) => void;
  options: Option[];
  loading?: boolean;
  label?: string;
  className?: string;
  placeholder?: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  onChange,
  value,
  options,
  loading,
  label,
  placeholder,
  className,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredData =
    query === ""
      ? options
      : options.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        );

  const current = options.find((e) => e.value === value) ?? null;

  // Закрытие по клику вне
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // При выборе опции — сбрасываем query
  useEffect(() => {
    if (current) setQuery(current.label);
  }, [current]);

  return (
    <div
      ref={wrapperRef}
      className={cva("relative w-full", className, {
        "animate-pulse": !!loading,
      })}
    >
      {label && (
        <label className="text-sm font-extrabold text-secondary">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={cva(
            "w-full border border-foreground-1 bg-white py-2 pl-3 pr-10 rounded-full h-[42px] px-4",
            "focus:border-accent focus:outline-none text-sm",
          )}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") onChange(undefined);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-y-0 right-2 flex items-center rounded-r-md px-2 focus:outline-none"
          onClick={() => {
            setOpen((prev) => {
              if (!prev) {
                inputRef.current?.focus();
              }
              return !prev;
            });
          }}
        >
          <ArrowDown className="size-3 text-secondary" />
        </button>
        <AnimatePresence>
          {open && filteredData.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-foreground-1 focus:outline-none text-sm"
            >
              {filteredData.map((item) => (
                <li
                  key={item.value}
                  className={cva(
                    "relative cursor-pointer select-none py-1.5 pl-3 pr-9 text-sm hover:bg-black/5",
                    {
                      "bg-foreground-1": current?.value === item.value,
                    },
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(item); // Только при выборе опции
                    setOpen(false);
                  }}
                >
                  <span className={"block truncate"}>{item.label}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchSelect;
