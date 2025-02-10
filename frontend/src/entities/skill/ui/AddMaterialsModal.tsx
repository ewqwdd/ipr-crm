import { skillsApi } from '@/shared/api/skillsApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SelectLight } from '@/shared/ui/SelectLight';
import { TextArea } from '@/shared/ui/TextArea';
import { FC, memo, useCallback, useState } from 'react';

interface AddIndicatorModalProps {
  type: 'COMPETENCY' | 'INDICATOR';
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

const checkLinkFormat = (link: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(link) ? undefined : 'Неверный формат ссылки';
};

type MaterialType = 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

const materialTypes = [
  { text: 'Видео', id: 'VIDEO' },
  { text: 'Книга', id: 'BOOK' },
  { text: 'Курс', id: 'COURSE' },
  { text: 'Статья', id: 'ARTICLE' },
];

export const AddMaterialType: FC<{
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

const levels = [0, 1, 2, 3, 4];

const AddLevel: FC<{ level: number; selectLevel: (level: number) => void }> =
  memo(({ level, selectLevel }) => {
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Уровень сложности
          <span className="text-red-500 font-bold ml-1">*</span>
        </p>
        <div
          className={`grid grid-cols-${levels.length} border border-gray-300 rounded-md overflow-hidden`}
        >
          {levels.map((levelItem) => (
            <button
              key={levelItem}
              className={`p-2 text-center border-r last:border-r-0 border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-all ${levelItem === level ? 'bg-gray-200' : ''}`}
              onClick={() => selectLevel(levelItem)}
            >
              {levelItem}
            </button>
          ))}
        </div>
      </div>
    );
  });

export default function AddMaterialsModal({
  type,
  isOpen,
  modalData,
  closeModal,
}: AddIndicatorModalProps) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [level, setLevel] = useState<number>(0);
  const [errors, setErrors] = useState<{ title?: string; link?: string }>({});

  const { name } = modalData as { name: string; id: string };

  const validate = () => {
    const newErrors: { title?: string; link?: string } = {};
    if (!title.trim()) newErrors.title = 'Поле не может быть пустым';
    const linkError = checkLinkFormat(link);
    if (linkError) newErrors.link = linkError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // const [mutate, { isLoading: mutateLoading }] =
  //   universalApi.useCreateSpecMutation();
  const [COMPETENCY_mutate, { isLoading: COMPETENCY_Loading }] =
    skillsApi.useAddCompetencyMaterialMutation();

  const [INDICATOR_mutate, { isLoading: INDICATOR_Loading }] =
    skillsApi.useAddIndicatorMaterialMutation();
  // const useSki

  const modalLoading = COMPETENCY_Loading || INDICATOR_Loading;

  const onSubmit = () => {
    if (!validate()) return;
    switch (type) {
      case 'COMPETENCY':
        COMPETENCY_mutate({
          competencyId: modalData.id,
          name: title,
          url: link,
          contentType: materialType,
          level,
        });
        break;
      case 'INDICATOR':
        INDICATOR_mutate({
          indicatorId: modalData.id,
          name: title,
          url: link,
          contentType: materialType,
          level,
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
  };

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

        <InputWithLabelLight
          label="Ссылка"
          placeholder="https://example.com/"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onBlur={() => validate()}
          required
          error={errors.link}
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
