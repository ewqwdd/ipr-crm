import { cva } from '@/shared/lib/cva';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  right?: ReactNode;
  error?: string;
  required?: boolean;
  inputClassName?: string;
}

export default forwardRef(function InputWithLabel(
  {
    label,
    className,
    name,
    right,
    error,
    required,
    inputClassName,
    ...props
  }: InputWithLabelProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  let labelElem;

  if (label) {
    labelElem = (
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 font-bold ml-1">*</span>}
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
        <input
          ref={ref}
          name={name}
          className={cva(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            inputClassName,
          )}
          {...props}
        />
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
