import { Material } from '@/entities/material';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC } from 'react';
type ActionBarProps = {
  selectedMaterials: Material[];
};

export const ActionBar: FC<ActionBarProps> = ({ selectedMaterials }) => {
  const isVissible = selectedMaterials.length > 0;

  return (
    <div
      className={`fixed bottom-0 w-2/3 p-2 bg-gray-300 flex items-center ${isVissible ? 'visible' : 'invisible'}`}
    >
      <span>Выбран 1 материал</span>
      <SoftButton className="ml-2">Снять выбор</SoftButton>
      <div className="ml-auto">
        {<SoftButton className="ml-2">Добавить в задачи</SoftButton>}
      </div>
      <SoftButton className="ml-2">Удалить</SoftButton>
    </div>
  );
};
