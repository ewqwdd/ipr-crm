import { skillsApi } from '@/shared/api/skillsApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { TextArea } from '@/shared/ui/TextArea';
import { useCallback, useEffect, useState } from 'react';
import { MaterialType } from '../model/types';
import toast from 'react-hot-toast';
import AddMaterialType from './AddMaterialType';
import AddLevel from './AddLevel';

interface AddIndicatorModalProps {
  type: 'COMPETENCY' | 'INDICATOR';
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

type ErorrsType = { title?: string; link?: string };

export default function AddMaterialsModal({
  type,
  isOpen,
  modalData,
  closeModal,
}: AddIndicatorModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [level, setLevel] = useState<number>(0);
  const [errors, setErrors] = useState<ErorrsType>({});

  const { name, id } = modalData as { name: string; id: number };

  const validate = () => {
    const newErrors: ErorrsType = {};
    if (!title.trim()) newErrors.title = 'Поле не может быть пустым';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [
    COMPETENCY_mutate,
    {
      isLoading: COMPETENCY_Loading,
      isSuccess: COMPETENCY_success,
      isError: COMPETENCY_error,
    },
  ] = skillsApi.useAddCompetencyMaterialMutation();

  const [
    INDICATOR_mutate,
    {
      isLoading: INDICATOR_Loading,
      isSuccess: INDICATOR_success,
      isError: INDICATOR_error,
    },
  ] = skillsApi.useAddIndicatorMaterialMutation();

  const modalLoading = COMPETENCY_Loading || INDICATOR_Loading;

  const onSubmit = () => {
    if (!validate()) return;
    switch (type) {
      case 'COMPETENCY':
        COMPETENCY_mutate({
          competencyId: id,
          name: title,
          url: link,
          contentType: materialType,
          level,
          description,
        });
        break;
      case 'INDICATOR':
        INDICATOR_mutate({
          indicatorId: id,
          name: title,
          url: link,
          contentType: materialType,
          level,
          description,
        });
        break;
      default:
        break;
    }
  };

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setMaterialType(type);
    },
    [setMaterialType],
  );

  const selectLevel = useCallback(
    (level: number) => {
      setLevel(level);
    },
    [setLevel],
  );

  const reset = () => {
    setMaterialType('VIDEO');
    setLevel(0);
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    if (COMPETENCY_success || INDICATOR_success) {
      closeModal();
      toast.success('Материал успешно добавлен');
    }
  }, [COMPETENCY_success, closeModal, INDICATOR_success]);

  useEffect(() => {
    if (COMPETENCY_error || INDICATOR_error) {
      toast.error('Ошибка при добавлении материала');
    }
  }, [COMPETENCY_error, INDICATOR_error]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Редактирование элемента"
      onSubmit={onSubmit}
      submitText="Добавить"
      loading={modalLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Название элемента: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <h3>Материалы для карты развития</h3>
        <TextArea
          label="Название"
          placeholder="Введите название материала"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => validate()}
          required
          error={errors.title}
        />

        <TextArea
          label="Описание"
          placeholder="Введите описание материала"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => validate()}
          required
        />

        <InputWithLabelLight
          label="Ссылка"
          placeholder="https://example.com/"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <AddMaterialType {...{ selectMaterialType, materialType }} />
        <AddLevel {...{ level, selectLevel }} />
        <PrimaryButton onClick={reset} className="max-w-max ml-auto" danger>
          Сбросить
        </PrimaryButton>
      </div>
    </Modal>
  );
}
