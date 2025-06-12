import { iprApi } from '@/shared/api/iprApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { ActionBar } from '@/widgets/ActionBar';
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
    <ActionBar
      selected={selected}
      loading={isLoading}
      clearSelected={() => setSelected?.([])}
      buttonsConfig={[
        {
          label: 'Удалить',
          onClick: onDelete,
          className: 'ml-auto max-sm:p-2',
          danger: true,
          hide: !isAdmin,
        },
      ]}
    />
  );
});
