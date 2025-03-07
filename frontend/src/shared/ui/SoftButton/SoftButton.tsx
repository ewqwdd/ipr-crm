import { cva } from '@/shared/lib/cva';
import { ButtonHTMLAttributes, memo } from 'react';
import { Link } from 'react-router';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  to?: string;
  danger?: boolean;
}

export default memo(function SoftButton({
  size = 'md',
  className,
  children,
  to,
  danger,
  ...props
}: SoftButtonProps) {
  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const newProps: any = {
    type: 'button',
    className: cva(
      'transition-colors inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 gap-2',
      sizes[size],
      {
        'bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500':
          !!danger,
      },
      className,
    ),
    ...props,
  };

  let Cmp;

  if (to) {
    Cmp = Link;
    newProps.to = to;
  } else {
    Cmp = 'button';
  }

  return <Cmp {...newProps}>{children}</Cmp>;
});
