import { memo, ReactNode } from 'react';

interface StatsItemProps {
  label?: ReactNode;
  value?: ReactNode;
}

export default memo(function StatsItem({ label, value }: StatsItemProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
});
