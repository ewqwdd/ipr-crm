import { FC, memo } from 'react';
import { MaterialType } from '../model/types';
import { SelectLight } from '@/shared/ui/SelectLight';

const materialTypes = [
  { text: 'Видео', id: 'VIDEO' },
  { text: 'Книга', id: 'BOOK' },
  { text: 'Курс', id: 'COURSE' },
  { text: 'Статья', id: 'ARTICLE' },
  { text: 'Задание', id: 'TASK' },
];

const AddMaterialType: FC<{
  materialType: string;
  selectMaterialType: (type: MaterialType) => void;
}> = memo(({ materialType, selectMaterialType }) => {
  return (
    <SelectLight
      label="Тип материала"
      name="materialType"
      value={materialType}
      onChange={(e) => selectMaterialType(e.target.value as MaterialType)}
      required
    >
      {materialTypes.map(({ id, text }) => (
        <option key={id} value={id}>
          {text}
        </option>
      ))}
    </SelectLight>
  );
});

export default AddMaterialType;
