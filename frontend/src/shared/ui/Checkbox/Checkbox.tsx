import { cva } from '@/shared/lib/cva'

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  title?: string
  description?: string
}

export default function Checkbox({ title, description, className, ...props }: CheckboxProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          className={cva('focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded', className)}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700">{title}</label>
        <p id="comments-description" className="text-gray-500">
          {description}
        </p>
      </div>
    </div>
  )
}
