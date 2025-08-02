import { useState, useId, useRef, type InputHTMLAttributes } from "react";
import Check from "@/shared/icons/Checkbox.svg";
import { cva } from "@/shared/lib/cva";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "title" | "onChange"> {
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  className = "",
  ...props
}: CheckboxProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(false);

  // Если checked не передан — работаем как неконтролируемый
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (value: boolean) => {
    if (!isControlled) setInternalChecked(value);
    onChange?.(value);
  };

  return (
    <div
      className={cva("flex items-center gap-2", className)}
      role="checkbox"
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <div className="relative">
        <div
          className={cva(
            "size-5 border rounded-sm cursor-pointer flex items-center justify-center transition-all duration-200 ease-out",
            {
              "bg-[var(--Accent)] border-[var(--Accent)]": isChecked,
              "bg-white border-[var(--Foreground-1)]": !isChecked,
              "opacity-50 cursor-not-allowed": disabled,
            },
          )}
        >
          <div
            className={cva("transition-all duration-200 ease-out", {
              "opacity-100 scale-100": isChecked,
              "opacity-0 scale-0": !isChecked,
            })}
          >
            <Check className="text-white" />
          </div>
        </div>
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={(e) => handleChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          ref={inputRef}
          {...props}
        />
      </div>
    </div>
  );
}
