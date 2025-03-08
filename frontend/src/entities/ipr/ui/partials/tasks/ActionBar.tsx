import { TaskType } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

type ActionBarProps = {
  selectedMaterials: number[];
  resetSelection: () => void;
  userId: number;
  planId: number;
  type?: TaskType;
};

const errorHandling = (
  addToBoard: boolean,
  transferToObvious: boolean,
  transferToOther: boolean,
  deleteTasks: boolean,
) => {
  switch (true) {
    case addToBoard:
      toast.error('Ошибка добавления материалов на доску');
      break;
    case transferToObvious:
      toast.error('Ошибка переноса материалов в очевидные зоны роста');
      break;
    case transferToOther:
      toast.error('Ошибка переноса материалов в прочие зоны роста');
      break;
    case deleteTasks:
      toast.error('Ошибка удаления материалов');
      break;
    default:
      break;
  }
};

const ActionBar: FC<ActionBarProps> = ({
  type,
  selectedMaterials,
  resetSelection,
  planId,
  userId,
}) => {
  const selectedMatterialsLength = selectedMaterials.length;
  const [deleteFn, deleteOptions] = iprApi.useDeleteTasksMutation();
  const [addBoardFn, addBoardOptions] = iprApi.useAddToBoardMutation();
  const [transferToObviousFn, transferToObviousOptions] =
    iprApi.useTransferToObviousMutation();
  const [transferToOtherFn, transferToOtherOptions] =
    iprApi.useTransferToOtherMutation();

  // Error handling
  useEffect(() => {
    if (
      addBoardOptions.isError ||
      transferToObviousOptions.isError ||
      transferToOtherOptions.isError ||
      deleteOptions.isError
    ) {
      errorHandling(
        addBoardOptions.isError,
        transferToObviousOptions.isError,
        transferToOtherOptions.isError,
        deleteOptions.isError,
      );
    }
  }, [
    addBoardOptions.isError,
    transferToObviousOptions.isError,
    transferToOtherOptions.isError,
    deleteOptions.isError,
  ]);

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

  const isLoading =
    deleteOptions.isLoading ||
    addBoardOptions.isLoading ||
    transferToObviousOptions.isLoading ||
    transferToOtherOptions.isLoading;

  return (
    <div
      style={{
        left: `min(33.3%, 24rem)`,
        width: `calc(100% - min(33.3%, 24rem))`,
      }}
      className={cva(
        `fixed bottom-0 p-2 bg-white border-t-black/10 border-t shadow-2xl flex items-center ${selectedMatterialsLength > 0 ? 'visible' : 'invisible'}`,
        {
          'animate-pulse pointer-events-none': !!isLoading,
        },
      )}
    >
      <span>Выбран {selectedMatterialsLength} материал</span>
      <SoftButton className="ml-2" onClick={resetSelection}>
        Снять выбор
      </SoftButton>
      <div className="ml-auto flex gap-2">
        {type === 'GENERAL' && (
          <SoftButton className="ml-2" onClick={addOnBoard}>
            Добавить на доску
          </SoftButton>
        )}
        {type === 'OTHER' && (
          <div className="flex gap-2">
            <SoftButton className="ml-2" onClick={transferToObvious}>
              Переместить в очевидные зоны роста
            </SoftButton>
            <SoftButton onClick={addOnBoard}>Добавить на доску</SoftButton>
          </div>
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

export default ActionBar;
