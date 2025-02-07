import { cva } from '@/shared/lib/cva';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import {
  ForwardedRef,
  forwardRef,
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

interface InputWithLabelProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name?: string;
  right?: ReactNode;
  error?: string;
}

export default forwardRef(function SelectLight(
  {
    label,
    className,
    name,
    right,
    error,
    children,
    ...props
  }: InputWithLabelProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  let labelElem;

  if (label) {
    labelElem = (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    );
  }

  return (
    <div>
      {(labelElem || right) && (
        <div className="flex justify-between">
          {labelElem}
          {right}
        </div>
      )}
      <div className={cva('mt-1 relative rounded-md shadow-sm', className)}>
        <select
          name={name}
          ref={ref}
          className={cva(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
});
