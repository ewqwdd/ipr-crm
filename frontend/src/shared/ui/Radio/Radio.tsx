import { InputHTMLAttributes, ReactNode, useId } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  children: ReactNode;
}

export default function Radio({
  checked,
  children,
  onChange,
  ...props
}: RadioProps) {
  const id = useId();
  return (
    <div className="flex items-center">
      <input
        type="radio"
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
        checked={checked}
        onChange={onChange}
        {...props}
        id={id}
      />
      <label
        className="ml-3 block text-sm font-medium text-gray-700"
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  );
}
