import { SoftButton } from '@/shared/ui/SoftButton';
import { XIcon } from '@heroicons/react/outline';
import { memo } from 'react';

interface SelectAllProps {
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  data: { id: number }[];
}

export default memo(function SelectAll({
  selected,
  setSelected,
  data,
}: SelectAllProps) {
  const handleSelectAll = () => {
    setSelected(data.map((item) => item.id));
  };
  const handleDeselectAll = () => {
    setSelected([]);
  };

  return (
    <div className="flex gap-2 absolute right-0 top-0">
      <SoftButton
        onClick={handleSelectAll}
        disabled={selected.length === data.length}
      >
        Выбрать всех
      </SoftButton>
      <SoftButton onClick={handleDeselectAll} danger>
        <XIcon className="h-4 w-4" />
      </SoftButton>
    </div>
  );
});
