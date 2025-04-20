import { TaskType } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TrashIcon, XIcon } from '@heroicons/react/outline';
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

  const onBoardText = (
    <>
      <span className="max-sm:hidden">Добавить на доску</span>
      <span className="sm:hidden">На доску</span>
    </>
  );

  const transferToOtherText = (
    <>
      <span className="max-sm:hidden">Переместить в прочие зоны роста</span>
      <span className="sm:hidden">В прочие зоны</span>
    </>
  );

  const transferToObviousText = (
    <>
      <span className="max-sm:hidden">Переместить в очевидные зоны роста</span>
      <span className="sm:hidden">В очевидные зоны</span>
    </>
  );

  return (
    <div
      style={{
        left: `min(33.3%, 24rem)`,
        width: `calc(100% - min(33.3%, 24rem))`,
      }}
      className={cva(
        `fixed bottom-0 p-2 bg-white border-t-black/10 border-t shadow-2xl flex items-center max-sm:!left-0 max-sm:!w-full ${selectedMatterialsLength > 0 ? 'visible' : 'invisible'}`,
        {
          'animate-pulse pointer-events-none': !!isLoading,
        },
      )}
    >
      <span className="max-sm:hidden">
        Выбран {selectedMatterialsLength} материал
      </span>
      <span className="sm:hidden text-sm mr-2">{selectedMatterialsLength}</span>
      <SoftButton className="ml-2 max-sm:p-2" onClick={resetSelection}>
        <span className="max-sm:hidden">Снять выбор</span>
        <XIcon className="size-5 sm:hidden" />
      </SoftButton>
      <div className="ml-auto flex gap-2">
        {type === 'GENERAL' && (
          <SoftButton className="ml-2 max-sm:p-1" onClick={addOnBoard}>
            {onBoardText}
          </SoftButton>
        )}
        {type === 'OTHER' && (
          <div className="flex gap-2">
            <SoftButton className="ml-2 max-sm:p-2" onClick={transferToObvious}>
              {transferToObviousText}
            </SoftButton>
            <SoftButton className="max-sm:p-2" onClick={addOnBoard}>
              {onBoardText}
            </SoftButton>
          </div>
        )}
        {type === 'OBVIOUS' && (
          <SoftButton className="ml-2 max-sm:p-2" onClick={transferToOther}>
            {transferToOtherText}
          </SoftButton>
        )}
      </div>
      <SoftButton className="ml-2 max-sm:p-2" onClick={removeTasks} danger>
        <span className="max-sm:hidden">Удалить</span>
        <TrashIcon className="size-5 sm:hidden" />
      </SoftButton>
    </div>
  );
};

export default ActionBar;
