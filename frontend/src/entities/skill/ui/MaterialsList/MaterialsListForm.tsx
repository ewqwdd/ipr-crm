import { FC, useCallback, useEffect, useState } from 'react';
import { AddMaterialType } from '../AddMaterialsModal';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TextArea } from '@/shared/ui/TextArea';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';

export type MaterialType = 'VIDEO' | 'BOOK' | 'COURSE' | 'ARTICLE';

interface IMaterialsListFormProps {
  type: 'ADD' | 'EDIT';
  name?: string;
  link?: string;
  materialType?: MaterialType;
  closeForm: () => void;
}

const checkLinkFormat = (link: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(link) ? undefined : 'Неверный формат ссылки';
};

export const MaterialsListForm: FC<IMaterialsListFormProps> = ({
  type,
  name,
  link,
  materialType,
  closeForm,
}) => {
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLink, setNewLink] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<MaterialType>('VIDEO');
  const [errors, setErrors] = useState<{ title?: string; link?: string }>({});

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setNewMaterialType(type);
    },
    [setNewMaterialType],
  );

  const validate = () => {
    const newErrors: { title?: string; link?: string } = {};
    if (!newTitle.trim()) newErrors.title = 'Поле не может быть пустым';
    const linkError = checkLinkFormat(newLink);
    if (linkError) newErrors.link = linkError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    console.log('EditSpecialization submit => ', {
      name: newTitle,
      link: newLink,
      type: newMaterialType,
    });
    closeForm();
  };

  useEffect(() => {
    if (type === 'EDIT' && name && link && materialType) {
      setNewTitle(name);
      setNewLink(link);
      setNewMaterialType(materialType);
    } else {
      setNewTitle('');
      setNewLink('');
      setNewMaterialType('VIDEO');
    }
  }, [type, name, link, materialType]);

  return (
    <div className="flex flex-col space-y-4 mt-10">
      <TextArea
        label="Название"
        placeholder="Введите название материала"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => validate()}
        required
        error={errors.title}
      />

      <InputWithLabelLight
        label="Ссылка"
        placeholder="https://example.com/"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
        onBlur={() => validate()}
        required
        error={errors.link}
      />
      <AddMaterialType
        materialType={newMaterialType}
        selectMaterialType={selectMaterialType}
      />
      <div className="flex justify-end space-x-2">
        <SoftButton onClick={submit}>
          {type === 'ADD' ? 'Добавить' : 'Редактировать'}
        </SoftButton>
        <SoftButton onClick={closeForm}>Закрыть</SoftButton>
      </div>
    </div>
  );
};
