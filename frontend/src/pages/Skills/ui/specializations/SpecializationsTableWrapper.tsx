import { FC } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import { PlusCircleIcon } from '@heroicons/react/outline';
import SpecializationsTable from './SpecializationsTable';
import { useModal } from '@/app/hooks/useModal';

type ISpecializationsTableProps = {
  setSelectSpec: React.Dispatch<React.SetStateAction<number | null>>;
};

const SpecializationsTableWrapper: FC<ISpecializationsTableProps> = ({setSelectSpec}) => {
  const { openModal } = useModal();
  const onClick = () => {
    openModal('ADD_SPECIALIZATION');
  };
  return (
    <div className="border-r border-gray-400 pt-4 ">
      <h2 className="text-xl font-medium mb-2">Специализации</h2>
      <div className="flex items-center space-2">
        <SoftButton className="space-2" size="xs" onClick={onClick}>
          <PlusCircleIcon className="h-5 w-5" />
          Добавить
        </SoftButton>
      </div>
      <SpecializationsTable setSelectedSpec={setSelectSpec} />
    </div>
  );
};

export default SpecializationsTableWrapper;
