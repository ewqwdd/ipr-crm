import { cva } from '@/shared/lib/cva';
import { memo } from 'react';

interface HeadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export default memo(function Heading({
  title,
  description,
  className,
}: HeadingProps) {
  return (
    <div className={cva('sm:flex-auto', className)}>
      <h1 className="text-base sm:text-xl font-semibold text-gray-900">
        {title}
      </h1>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
    </div>
  );
});
