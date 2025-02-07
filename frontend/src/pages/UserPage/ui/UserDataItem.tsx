import { cva } from '@/shared/lib/cva';
import { ReactNode } from 'react';

interface UserDataItemProps {
  label?: ReactNode;
  value?: ReactNode;
  valueStyles?: string;
  className?: string;
}

export default function UserDataItem({
  label,
  value,
  valueStyles,
  className,
}: UserDataItemProps) {
  return (
    <div className={cva('sm:col-span-1', className)}>
      <dt className="text-sm font-medium text-gray-500">{label ?? '-'}</dt>
      <dd className={cva('mt-1 text-sm text-gray-900', valueStyles)}>
        {value ?? '-'}
      </dd>
    </div>
  );
}
