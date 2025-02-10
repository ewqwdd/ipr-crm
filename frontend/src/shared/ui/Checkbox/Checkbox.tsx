import { cva } from '@/shared/lib/cva';
import { HTMLAttributes, useId } from 'react';

interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  title?: string;
  description?: string;
  name?: string;
  checked?: boolean;
}

export default function Checkbox({
  title,
  description,
  className,
  ...props
}: CheckboxProps) {
  const id = useId();
  return (
    <div className={cva('relative flex items-center', className)}>
      <input
        type="checkbox"
        checked={props.checked}
        className={
          'focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer'
        }
        {...props}
        id={id}
      />
      {(title || description) && (
        <div className="ml-3 text-sm flex-1 flex flex-col">
          <label
            className="font-medium text-gray-700 cursor-pointer"
            htmlFor={id}
          >
            {title}
          </label>
          <p id="comments-description" className="text-gray-500">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
