import { SoftButton } from '@/shared/ui/SoftButton';
import { FC } from 'react';
type ActionBarProps = {
  selectedMaterials: number[];
  resetSelection: () => void;
};

export const ActionBar: FC<ActionBarProps> = ({
  selectedMaterials,
  resetSelection,
}) => {
  const selectedMatterialsLength = selectedMaterials.length;

  const removeTasks = () => {
    console.log('Remove tasks => ', selectedMaterials);
  };

  const addToTasks = () => {
    //
  };

  return (
    <div
      style={{
        left: `min(33.3%, 24rem)`,
        width: `calc(100% - min(33.3%, 24rem))`,
      }}
      className={`fixed bottom-0 p-2 bg-gray-300 flex items-center ${selectedMatterialsLength > 0 ? 'visible' : 'invisible'}`}
    >
      <span>Выбран {selectedMatterialsLength} материал</span>
      <SoftButton className="ml-2" onClick={resetSelection}>
        Снять выбор
      </SoftButton>
      <div className="ml-auto">
        {
          <SoftButton className="ml-2" onClick={addToTasks}>
            Добавить в задачи
          </SoftButton>
        }
      </div>
      <SoftButton className="ml-2" onClick={removeTasks}>
        Удалить
      </SoftButton>
    </div>
  );
};
