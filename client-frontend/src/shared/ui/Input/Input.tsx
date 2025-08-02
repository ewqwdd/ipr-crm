import { cva } from "@/shared/lib/cva";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  right?: ReactNode;
  error?: ReactNode;
  className?: string;
  inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, right, error, className = "", inputClassName = "", ...props },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {(label || right) && (
          <div className="flex items-center justify-between">
            {label && (
              <label className="text-sm font-extrabold text-secondary">
                {label}
              </label>
            )}
            {right && <div>{right}</div>}
          </div>
        )}
        <input
          ref={ref}
          className={cva(
            "px-4 text-sm h-[42px] text-primary placeholder:text-secondary font-extrabold bg-white border outline-none transition-colors focus:border-blue-500 border-foreground-1 rounded-full min-w-60",
            {
              "border-error": !!error,
            },
            inputClassName,
          )}
          {...props}
        />
        {error && (
          <div className="text-sm font-extrabold text-error">{error}</div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
