import { cva } from '@/shared/lib/cva';
import { HTMLAttributes, memo } from 'react';

interface PingCircleProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export default memo(function PingCircle({
  className,
  children,
  ...props
}: PingCircleProps) {
  return (
    <span
      className={cva('absolute top-[-6px] right-[-6px] flex size-4', className)}
      {...props}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex size-4 rounded-full bg-sky-500 justify-center items-center text-white text-xs">
        {children}
      </span>
    </span>
  );
});
