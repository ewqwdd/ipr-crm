import { cva } from "@/shared/lib/cva";
import Card from "@/shared/ui/Card";
import ShadowCard from "@/shared/ui/ShadowCard";
import Title from "@/shared/ui/Title";
import type { PropsWithChildren, ReactNode } from "react";

interface GridCardsListLayoutProps {
  loading?: boolean;
  className?: string;
  titleClassName?: string;
  title?: string;
  description?: string;
  button?: ReactNode;
  wrapperClassName?: string;
  isEmpty?: boolean;
}

export default function GridCardsListLayout({
  children,
  className,
  loading,
  titleClassName,
  description,
  title,
  button,
  wrapperClassName,
  isEmpty,
}: PropsWithChildren<GridCardsListLayoutProps>) {
  return (
    <Card className={cva("py-5", className)}>
      <div className="flex justify-between items-center">
        <Title
          className={titleClassName}
          title={title}
          description={description}
        />
        {button}
      </div>

      {!loading && !isEmpty && (
        <div className={cva("grid grid-cols-2 gap-3", wrapperClassName)}>
          {loading &&
            new Array(4)
              .fill(0)
              .map((_, index) => (
                <ShadowCard
                  className="min-h-[132px] animate-pulse"
                  key={index}
                />
              ))}
          {!loading && children}
        </div>
      )}
    </Card>
  );
}
