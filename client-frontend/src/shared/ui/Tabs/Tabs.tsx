import { cva } from "@/shared/lib/cva";
import React from "react";

type Tab = {
  label: React.ReactNode;
  value: string;
};

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={cva(
        "flex border-b border-foreground-1 font-extrabold gap-5",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cva(
              "text-sm pb-4 transition-all relative cursor-pointer",
              {
                "text-accent": isActive,
              },
            )}
            style={{ outline: "none" }}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute left-0 right-0 -bottom-px z-50 h-px bg-accent"
                style={{ content: '""' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
