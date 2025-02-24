import { ReactNode } from 'react';

interface StatProps {
  title?: ReactNode;
  value?: ReactNode;
}

export default function Stat({ title, value }: StatProps) {
  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
