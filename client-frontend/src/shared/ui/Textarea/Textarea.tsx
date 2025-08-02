import { cva } from "@/shared/lib/cva";
import { forwardRef, type TextareaHTMLAttributes, type ReactNode } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  right?: ReactNode;
  error?: ReactNode;
  className?: string;
  textareaClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, right, error, className = "", textareaClassName = "", ...props },
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
        <textarea
          ref={ref}
          className={cva(
            "p-3 text-sm h-[96px] text-primary placeholder:text-secondary font-extrabold bg-white border outline-none transition-colors focus:border-blue-500 border-foreground-1 rounded-xl min-w-60 resize-none",
            {
              "border-error": !!error,
            },
            textareaClassName,
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

Textarea.displayName = "Textarea";

export default Textarea;
