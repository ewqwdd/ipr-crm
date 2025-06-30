import { TaskType } from '@/entities/ipr/model/types';
import { iprApi } from '@/shared/api/iprApi';
import { ActionBar } from '@/widgets/ActionBar';
import { TrashIcon } from '@heroicons/react/outline';
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

const IprEditSettings: FC<ActionBarProps> = ({
  type,
  selectedMaterials,
  resetSelection,
  planId,
  userId,
}) => {
  const [deleteFn, deleteOptions] = iprApi.useDeleteTasksMutation();
  const [addBoardFn, addBoardOptions] = iprApi.useAddToBoardMutation();
  const [transferToObviousFn, transferToObviousOptions] =
    iprApi.useTransferToObviousMutation();
  const [transferToOtherFn, transferToOtherOptions] =
    iprApi.useTransferToOtherMutation();

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

  if (selectedMaterials.length === 0) {
    return null;
  }

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
    <ActionBar
      selected={selectedMaterials}
      loading={isLoading}
      clearSelected={resetSelection}
      buttonsConfig={[
        {
          label: onBoardText,
          onClick: addOnBoard,
          hide: type !== 'GENERAL' && type !== 'OTHER',
        },
        {
          label: transferToObviousText,
          onClick: transferToObvious,
          hide: type !== 'OTHER',
        },
        {
          label: transferToOtherText,
          onClick: transferToOther,
          hide: type !== 'OBVIOUS',
        },
        {
          label: 'Удалить',
          onClick: removeTasks,
          danger: true,
          icon: <TrashIcon className="text-red-500" />,
        },
      ]}
    />
  );
};

export default IprEditSettings;
