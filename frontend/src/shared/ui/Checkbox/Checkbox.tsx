import { cva } from '@/shared/lib/cva'
import { useId } from 'react'

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  title?: string
  description?: string
}

export default function Checkbox({ title, description, className, ...props }: CheckboxProps) {
  const id = useId()
  return (
    <div className={cva('relative flex items-center', className)}>
        <input
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          className={'focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer'}
          {...props}
          id={id}
        />
      <div className="ml-3 text-sm flex-1 flex flex-col">
        <label className="font-medium text-gray-700 cursor-pointer" htmlFor={id}>
          {title}
        </label>
        <p id="comments-description" className="text-gray-500">
          {description}
        </p>
      </div>
    </div>
  )
}
