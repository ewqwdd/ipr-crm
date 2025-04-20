import { Modal } from '@/shared/ui/Modal';
import { CompetencyBlock } from '../types/types';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { skillsApi } from '@/shared/api/skillsApi';
import EditMultipleIndicators from './EditMultipleIndicators/EditMultipleIndicators';

interface AddCompetencyModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function AddCompetencyModal({
  isOpen,
  modalData,
  closeModal,
}: AddCompetencyModalProps) {
  const [value, setValue] = useState('');
  const [indicators, setIndicators] = useState<string[]>([]);

  const [createCompetency, comppetencyProps] =
    skillsApi.useCreateCompetencyMutation();

  const { id, name } = modalData as Pick<CompetencyBlock, 'id' | 'name'>;

  const competencySubmit = (name: string) => {
    if (!id) {
      return toast.error('Не выбран блок компетенций');
    }
    if (!name) {
      return toast.error('Необходимо указать название компетенции');
    }
    const indicatorsToCreate = indicators
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    createCompetency({
      name,
      blockId: id,
      indicators: indicatorsToCreate.length > 0 ? indicatorsToCreate : [],
    });
    closeModal();
  };

  useEffect(() => {
    if (comppetencyProps.isError) {
      toast.error('Не удалось создать компетенцию');
    }
    if (comppetencyProps.isSuccess) {
      toast.success('Компетенция успешно создана');
    }
  }, [comppetencyProps.isError, comppetencyProps.isSuccess]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Новые компетенции"
      onSubmit={() => competencySubmit(value)}
      submitText="Добавить"
      loading={comppetencyProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Блок компетенций: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <InputWithLabelLight
          placeholder="Название компетенции"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="mt-0.5 text-sm text-gray-900 font-medium">Индикаторы:</p>
        <EditMultipleIndicators
          indicators={indicators}
          setIndicators={setIndicators}
        />
      </div>
    </Modal>
  );
}
