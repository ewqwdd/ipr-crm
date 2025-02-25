import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
type ActionBarProps = {
  type: string;
  selectedMaterials: number[];
  resetSelection: () => void;
};

const successHandling = (
  addToBoard: boolean,
  transferToGeneral: boolean,
  transferToObvious: boolean,
  transferToOther: boolean,
  deleteTasks: boolean,
) => {
  switch (true) {
    case addToBoard:
      console.log('addToBoard_success => ', addToBoard);
      toast.success('Материалы успешно добавлены на доску');
      break;
    case transferToGeneral:
      toast.success('Материалы успешно перенесены в общие зоны роста');
      break;
    case transferToObvious:
      toast.success('Материалы успешно перенесены в очевидные зоны роста');
      break;
    case transferToOther:
      toast.success('Материалы успешно перенесены в прочие зоны роста');
      break;
    case deleteTasks:
      toast.success('Материалы успешно удалены');
      break;
    default:
      break;
  }
};
const errorHandling = (
  addToBoard: boolean,
  transferToGeneral: boolean,
  transferToObvious: boolean,
  transferToOther: boolean,
  deleteTasks: boolean,
) => {
  switch (true) {
    case addToBoard:
      toast.error('АУЕ Ошибка добавления материалов на доску');
      break;
    case transferToGeneral:
      toast.error('АУЕ Ошибка переноса материалов в общие зоны роста');
      break;
    case transferToObvious:
      toast.error('АУЕ Ошибка переноса материалов в очевидные зоны роста');
      break;
    case transferToOther:
      toast.error('АУЕ Ошибка переноса материалов в прочие зоны роста');
      break;
    case deleteTasks:
      toast.error('АУЕ Ошибка удаления материалов');
      break;
    default:
      break;
  }
};

const ActionBar: FC<ActionBarProps> = ({
  type,
  selectedMaterials,
  resetSelection,
}) => {
  const selectedMatterialsLength = selectedMaterials.length;

  const [
    addToBoard_mutate,
    {
      isLoading: addToBoard_Loading,
      isSuccess: addToBoard_success,
      isError: addToBoard_error,
    },
  ] = iprApi.useAddToBoardMutation();

  const [
    transferToGeneral_mutate,
    {
      isLoading: transferToGeneral_Loading,
      isSuccess: transferToGeneral_success,
      isError: transferToGeneral_error,
    },
  ] = iprApi.useTransferToGeneralMutation();

  const [
    transferToObvious_mutate,
    {
      isLoading: transferToObvious_Loading,
      isSuccess: transferToObvious_success,
      isError: transferToObvious_error,
    },
  ] = iprApi.useTransferToObviousMutation();

  const [
    transferToOther_mutate,
    {
      isLoading: transferToOther_Loading,
      isSuccess: transferToOther_success,
      isError: transferToOther_error,
    },
  ] = iprApi.useTransferToOtherMutation();

  const [
    deleteTasks_mutate,
    {
      isLoading: deleteTasks_Loading,
      isSuccess: deleteTasks_success,
      isError: deleteTasks_error,
    },
  ] = iprApi.useDeleteTaskMutation();

  // Erorr handling
  useEffect(() => {
    errorHandling(
      addToBoard_error,
      transferToGeneral_error,
      transferToObvious_error,
      transferToOther_error,
      deleteTasks_error,
    );
  }, [
    addToBoard_error,
    transferToGeneral_error,
    transferToObvious_error,
    transferToOther_error,
    deleteTasks_error,
  ]);

  // Success handling
  useEffect(() => {
    //
    successHandling(
      addToBoard_success,
      transferToGeneral_success,
      transferToObvious_success,
      transferToOther_success,
      deleteTasks_success,
    );
  }, [
    addToBoard_success,
    transferToGeneral_success,
    transferToObvious_success,
    transferToOther_success,
    deleteTasks_success,
  ]);

  const addToBoard = () => {
    addToBoard_mutate({ ids: selectedMaterials });
  };

  // TODO: understand why?
  const moveToGeneral = () => {
    transferToGeneral_mutate({ ids: selectedMaterials });
  };

  const moveToObvious = () => {
    transferToObvious_mutate({ ids: selectedMaterials });
  };

  const moveToOthers = () => {
    transferToOther_mutate({ ids: selectedMaterials });
  };

  const removeTasks = () => {
    deleteTasks_mutate({ ids: selectedMaterials });
  };

  const isLoading =
    addToBoard_Loading ||
    transferToGeneral_Loading ||
    transferToObvious_Loading ||
    transferToOther_Loading ||
    deleteTasks_Loading;

  return (
    <div
      style={{
        left: `min(33.3%, 24rem)`,
        width: `calc(100% - min(33.3%, 24rem))`,
      }}
      className={cva(
        `fixed bottom-0 p-2 bg-gray-300 flex items-center ${selectedMatterialsLength > 0 ? 'visible' : 'invisible'}`,
        {
          'animate-pulse': !!isLoading,
        },
      )}
    >
      <span>Выбран {selectedMatterialsLength} материал</span>
      <SoftButton className="ml-2" onClick={resetSelection}>
        Снять выбор
      </SoftButton>
      <div className="ml-auto">
        {type === 'GENERAL' && (
          <SoftButton className="ml-2" onClick={addToBoard}>
            Добавить на доску
          </SoftButton>
        )}
        {type === 'OBVIOUS' && (
          <SoftButton className="ml-2" onClick={moveToOthers}>
            Перенести в прочие навыки развития
          </SoftButton>
        )}
        {type === 'OTHER' && (
          <div className="flex gap-2">
            <SoftButton onClick={moveToObvious}>
              Перенести в очеведные зоны роста
            </SoftButton>
            <SoftButton onClick={addToBoard}>Добавить на доску</SoftButton>
          </div>
        )}
      </div>
      <SoftButton className="ml-2" onClick={removeTasks}>
        Удалить
      </SoftButton>
    </div>
  );
};

export default ActionBar;
