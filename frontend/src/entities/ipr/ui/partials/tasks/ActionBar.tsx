import { TaskType } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useEffect } from 'react';

type ActionBarProps = {
  selectedMaterials: number[];
  resetSelection: () => void;
  userId: number;
  planId: number;
  type: TaskType;
};

export const ActionBar: FC<ActionBarProps> = ({
  selectedMaterials,
  resetSelection,
  planId,
  userId,
  type,
}) => {
  const selectedMatterialsLength = selectedMaterials.length;
  const [deleteFn, deleteOptions] = iprApi.useDeleteTasksMutation();
  const [addBoardFn, addBoardOptions] = iprApi.useAddToBoardMutation();
  const [transferToObviousFn, transferToObviousOptions] =
    iprApi.useTransferToObviousMutation();
  const [transferToOtherFn, transferToOtherOptions] =
    iprApi.useTransferToOtherMutation();

  const removeTasks = () => {
    deleteFn({ ids: selectedMaterials, planId, userId });
  };

  const addOnBoard = () => {
    addBoardFn({ ids: selectedMaterials, planId, userId });
  };

  const transferToObvious = () => {
    transferToObviousFn({ ids: selectedMaterials, planId, userId });
  };

  const transferToOther = () => {
    transferToOtherFn({ ids: selectedMaterials, planId, userId });
  };

  const isSuccess =
    deleteOptions.isSuccess ||
    addBoardOptions.isSuccess ||
    transferToObviousOptions.isSuccess ||
    transferToOtherOptions.isSuccess;
  const isLoading =
    deleteOptions.isLoading ||
    addBoardOptions.isLoading ||
    transferToObviousOptions.isLoading ||
    transferToOtherOptions.isLoading;

  useEffect(() => {
    if (isSuccess) {
      resetSelection();
    }
  }, [isSuccess]);

  return (
    <div
      style={{
        left: `min(33.3%, 24rem)`,
        width: `calc(100% - min(33.3%, 24rem))`,
      }}
      className={cva(
        'fixed bottom-0 p-2 pb-4 border-t-2 border-black/5 bg-white shadow-2xl flex items-center invisible',
        {
          visible: selectedMatterialsLength > 0,
          'animate-pulse pointer-events-none': isLoading,
        },
      )}
    >
      <span>Выбран {selectedMatterialsLength} материал</span>
      <SoftButton className="ml-2" onClick={resetSelection}>
        Снять выбор
      </SoftButton>
      <div className="ml-auto flex gap-2">
        {type !== 'OBVIOUS' && (
          <SoftButton className="ml-2" onClick={addOnBoard}>
            Добавить на доску
          </SoftButton>
        )}
        {type === 'OTHER' && (
          <SoftButton className="ml-2" onClick={transferToObvious}>
            Переместить в очевидные зоны роста
          </SoftButton>
        )}
        {type === 'OBVIOUS' && (
          <SoftButton className="ml-2" onClick={transferToOther}>
            Переместить в прочие зоны роста
          </SoftButton>
        )}
      </div>
      <SoftButton className="ml-2" onClick={removeTasks} danger>
        Удалить
      </SoftButton>
    </div>
  );
};
