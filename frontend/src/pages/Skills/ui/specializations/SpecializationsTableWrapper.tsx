import { FC } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';
import SpecializationsTable from './SpecializationsTable';
import { useModal } from '@/app/hooks/useModal';

type ISpecializationsTableProps = {
  selectedSpec: number | null;
  setSelectSpec: React.Dispatch<React.SetStateAction<number | null>>;
};

const SpecializationsTableWrapper: FC<ISpecializationsTableProps> = ({
  selectedSpec,
  setSelectSpec,
}) => {
  const { openModal } = useModal();
  const onClick = () => {
    openModal('ADD_SPECIALIZATION');
  };
  return (
    <div className="sm:border-r max-sm:border border-gray-200 sm:pt-4 max-sm:p-2 ">
      <h2 className="text-xl font-medium mb-2">Специализации</h2>
      <div className="flex items-center space-2">
        <SoftButton className="space-2" size="xs" onClick={onClick}>
          <PlusCircleIcon className="h-5 w-5" />
          Добавить
        </SoftButton>
      </div>
      <SpecializationsTable
        selectedSpec={selectedSpec}
        setSelectedSpec={setSelectSpec}
      />
    </div>
  );
};

export default SpecializationsTableWrapper;
