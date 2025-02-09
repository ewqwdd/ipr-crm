import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SelectLight } from '@/shared/ui/SelectLight';
import { TextArea } from '@/shared/ui/TextArea';
import { ChangeEvent, FC, memo, useCallback, useState } from 'react';

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

const validate = (value: string) => {
  if (!value.trim()) {
    return 'Поле не может быть пустым';
  }
  return '';
};

const TitleInput: FC<{
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}> = memo(({ value, onChange }) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    setError(validationError);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTouched(true);
    setError(validate(e.target.value));
    onChange(e);
  };

  return (
    <TextArea
      label="Название"
      placeholder="Введите название материала"
      value={value}
      onChange={handleChange}
      required
      onBlur={handleBlur}
      error={touched ? error : undefined}
    />
  );
});

const LinkInput: FC<{
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = memo(({ value, onChange }) => {
  const [error, setError] = useState<string | undefined>('');
  const [touched, setTouched] = useState<boolean>(false);

  const handleError = (link?: string) => {
    const errorTest = checkLinkFormat(link || value);
    if (errorTest) {
      setError(errorTest);
    } else {
      setError(undefined);
    }
  };

  const onChangeWrapper = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    handleError(e.target.value);
    onChange(e);
  };
  const handleBlur = () => {
    setTouched(true);
    handleError();
  };
  return (
    <InputWithLabelLight
      label="Ссылка"
      placeholder="https://example.com/"
      value={value}
      onChange={onChangeWrapper}
      required
      error={touched ? error : undefined}
      onBlur={handleBlur}
    />
  );
});

type MaterialType = 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

const materialTypes = [
  { text: 'Видео', id: 'VIDEO' },
  { text: 'Книга', id: 'BOOK' },
  { text: 'Курс', id: 'COURSE' },
  { text: 'Статья', id: 'ARTICLE' },
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
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [level, setLevel] = useState<number>(0);

  const { name } = modalData as { name: string; id: string };

  const payload = {
    // TODO: fix type
    ...(modalData as { name: string; id: string }),
    name: title,
    url: link,
    contentType: materialType,
    level,
  };

  const onSubmit = () => {
    // TODO: add api calls
    //
    switch (type) {
      case 'COMPETENCY':
        console.log('onSubmit', payload);
        break;
      case 'INDICATOR':
        console.log('onSubmit', payload);
        break;
      default:
        break;
    }
  };

  const onChangeTitle = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );
  const onChangeLink = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLink(e.target.value);
    },
    [setLink],
  );

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
    setTitle('');
    setLink('');
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
      //   loading={indicatorProps.isLoading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Название элемента: <span className="text-gray-900 ml-1">{name}</span>
        </p>
        <h3>Материалы для карты развития</h3>
        <TitleInput value={title} onChange={onChangeTitle} />
        <LinkInput value={link} onChange={onChangeLink} />

        <AddMaterialType {...{ selectMaterialType, materialType }} />
        <AddLevel {...{ level, selectLevel }} />
        <PrimaryButton onClick={reset} className="max-w-max ml-auto" danger>
          Сбросить
        </PrimaryButton>
      </div>
    </Modal>
  );
}
