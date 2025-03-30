import { FolderIcon } from '@heroicons/react/outline';
import { memo } from 'react';

export default memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 flex-1 w-full text-sm text-gray-500 font-medium">
      <FolderIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
      Пусто
    </div>
  );
});
