import { cva } from '@/shared/lib/cva';
import { HTMLAttributes, memo, ReactNode } from 'react';

const colors = {
  gray: 'bg-gray-100 text-gray-800 border-gray-800/10',
  red: 'bg-red-100 text-red-800 border-red-800/10',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-800/10',
  green: 'bg-green-100 text-green-800 border-green-800/10',
  blue: 'bg-blue-100 text-blue-800 border-blue-800/10',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-800/10',
  purple: 'bg-purple-100 text-purple-800 border-purple-800/10',
  pink: 'bg-pink-100 text-pink-800 border-pink-800/10',
} as const;

type Variant = keyof typeof colors;
type Size = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  color?: Variant;
  className?: string;
  size?: Size;
  border?: boolean;
}

const Badge = ({
  color,
  children,
  className,
  size = 'sm',
  border,
  ...props
}: BadgeProps) => {
  const clr: Variant =
    color ||
    (Object.keys(colors)[
      Math.floor(Math.random() * Object.keys(colors).length)
    ] as Variant);

  const sizes: Record<Size, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={cva(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800',
        colors[clr],
        sizes[size],
        { border: !!border },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

const MemoizedBadge = Object.assign(memo(Badge), { colors });

export default MemoizedBadge;
