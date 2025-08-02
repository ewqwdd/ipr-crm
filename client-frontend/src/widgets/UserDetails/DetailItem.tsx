import { cva } from "@/shared/lib/cva";
import type { ReactNode } from "react";

interface DetailItemProps {
  label: string;
  value?: ReactNode;
  className?: string;
}

export default function DetailItem({
  label,
  value,
  className,
}: DetailItemProps) {
  return (
    <div className={cva("flex flex-col font-extrabold", className)}>
      <h3 className="text-secondary text-sm">{label}</h3>
      <div
        className={cva("text-teritary flex gap-2 flex-wrap", {
          "text-primary": !!value,
        })}
      >
        {value ? value : "Неизвестно"}
      </div>
    </div>
  );
}
