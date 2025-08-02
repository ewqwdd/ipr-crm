import { cva } from "@/shared/lib/cva";
import type { ReactNode } from "react";

const StatItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value?: ReactNode;
  className?: string;
}) => (
  <div className={cva("flex flex-col text-sm", className)}>
    <h3 className="text-secondary">{label}</h3>
    <p>{value}</p>
  </div>
);

export default StatItem;
