import { cva } from '@/shared/lib/cva'
import { ButtonHTMLAttributes, memo } from 'react'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
}

export default memo(function PrimaryButton({ size = 'md', className, children, ...props }: PrimaryButtonProps) {
  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  }

  return (
      <button
        type="button"
        className={cva(
          'inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
  )
})
