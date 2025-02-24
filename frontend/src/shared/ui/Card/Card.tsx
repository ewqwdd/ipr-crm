import { cva } from '@/shared/lib/cva';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cva('bg-white overflow-hidden shadow rounded-lg', className)}
      {...props}
    >
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
