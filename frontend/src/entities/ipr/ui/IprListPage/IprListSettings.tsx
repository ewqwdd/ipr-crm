import { iprApi } from '@/shared/api/iprApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { memo, useEffect } from 'react';

interface IprListSettingsProps {
  selected: number[];
  isLoading?: boolean;
  setSelected?: React.Dispatch<React.SetStateAction<number[]>>;
}

export default memo(function IprListSettings({
  isLoading,
  selected,
  setSelected,
}: IprListSettingsProps) {
  const [deleteIprs, deleteIprsState] = iprApi.useDeleteIprsMutation();
  const isAdmin = useIsAdmin();

  const onDelete = () => {
    deleteIprs({ ids: selected });
  };

  useEffect(() => {
    if (deleteIprsState.isSuccess) {
      setSelected?.([]);
    }
  }, [deleteIprsState.isSuccess, setSelected]);

  return (
    <div
      className={cva(
        'flex gap-3 p-3 pb-5 fixed bottom-0 right-0 w-full bg-white shadow-2xl items-center',
        {
          'animate-pulse pointer-events-none':
            deleteIprsState.isLoading || !!isLoading,
        },
      )}
    >
      <p className="font-medium text-gray-800 max-sm:text">
        <span className="max-sm:hidden">Выбрано</span> {selected.length}
      </p>
      <button className="text-indigo-500 hover:text-indigo-700 max-sm:text-sm font-medium">
        Сбросить
      </button>

      {isAdmin && (
        <SoftButton onClick={onDelete} className="ml-auto max-sm:p-2" danger>
          Удалить
        </SoftButton>
      )}
    </div>
  );
});
