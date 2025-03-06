import { FC, useCallback, useEffect, useState } from 'react';
import AddMaterialType from '@/entities/material/ui/AddMaterialType';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TextArea } from '@/shared/ui/TextArea';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { skillsApi } from '@/shared/api/skillsApi';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/app';
import { Material, MaterialType } from '@/entities/material';
import { setModalData } from '@/app/store/modalSlice';
import { CompetencyType } from '../../types/types';

interface IMaterialsListFormProps extends Partial<Material> {
  type: 'ADD' | 'EDIT';
  closeForm: () => void;
  parentId?: number;
  parentType?: CompetencyType;
}

export const MaterialsListForm: FC<IMaterialsListFormProps> = ({
  type,
  name,
  contentType,
  closeForm,
  id,
  description,
  level,
  url,
  parentType,
  parentId,
}) => {
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newLink, setNewLink] = useState<string>('');
  const [newMaterialType, setNewMaterialType] = useState<MaterialType>('VIDEO');
  const [errors, setErrors] = useState<{ title?: string; link?: string }>({});

  const [editMaterial, editPtoperties] = skillsApi.useEditMaterialMutation();
  const [addMaterialIndicator, addPropertiesIndicator] =
    skillsApi.useAddIndicatorMaterialMutation();
  const [addMaterialCompetency, addPropertiesCompetency] =
    skillsApi.useAddCompetencyMaterialMutation();

  const [newLevel, setNewLevel] = useState<number>(1);
  const dispatch = useDispatch();
  const modalData = useAppSelector((state) => state.modal.modalData);

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setNewMaterialType(type);
    },
    [setNewMaterialType],
  );

  const validate = () => {
    const newErrors: { title?: string; link?: string } = {};
    if (!newTitle.trim()) newErrors.title = 'Поле не может быть пустым';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const edit = () => {
    if (!id) return;
    const newMaterial = {
      name: newTitle,
      url: newLink,
      contentType: newMaterialType,
      level: newLevel,
      description: newDesc,
    };

    editMaterial({
      id,
      ...newMaterial,
    });

    let oldData = modalData as { materials: { material: Material }[] };

    const foundIndex = oldData.materials?.findIndex(
      (material) => material.material.id === id,
    );

    if (foundIndex !== -1) {
      const materials = oldData.materials.map((m, index) =>
        index === foundIndex
          ? { ...m, material: { ...m.material, ...newMaterial } }
          : m,
      );

      oldData = { ...oldData, materials };
      dispatch(setModalData(oldData));
    }
  };

  const add = () => {
    const newMaterial = {
      name: newTitle,
      url: newLink,
      contentType: newMaterialType,
      level: newLevel,
      description: newDesc,
    };

    if (parentType === CompetencyType.COMPETENCY) {
      addMaterialCompetency({
        competencyId: parentId,
        ...newMaterial,
      });
    } else {
      addMaterialIndicator({
        indicatorId: parentId,
        ...newMaterial,
      });
    }

    const data = modalData as { materials: { material: Material }[] };
    dispatch(
      setModalData({
        ...data,
        materials: [...data.materials, { material: newMaterial }],
      }),
    );
  };

  const submit = () => {
    if (!validate()) return;
    if (type === 'ADD') {
      add();
    } else {
      edit();
    }
  };

  useEffect(() => {
    if (type === 'EDIT') {
      setNewTitle(name ?? '');
      setNewLink(url ?? '');
      setNewMaterialType(contentType ?? 'VIDEO');
      setNewDesc(description ?? '');
      setNewLevel(level ?? 1);
    } else {
      setNewTitle('');
      setNewLink('');
      setNewDesc('');
      setNewMaterialType('VIDEO');
      setNewLevel(1);
    }
  }, [type, name, url, contentType, description, level]);

  const isSuccess =
    editPtoperties.isSuccess ||
    addPropertiesCompetency.isSuccess ||
    addPropertiesIndicator.isSuccess;
  const isError =
    editPtoperties.isError ||
    addPropertiesCompetency.isError ||
    addPropertiesIndicator.isError;

  useEffect(() => {
    if (isSuccess) closeForm();
  }, [isSuccess, closeForm]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при сохранении');
    }
  }, [isError]);

  return (
    <div
      className={cva('flex flex-col space-y-4 mt-10', {
        'animate-pulse pointer-events-none':
          editPtoperties.isLoading ||
          addPropertiesIndicator.isLoading ||
          addPropertiesCompetency.isLoading,
      })}
    >
      <TextArea
        label="Название"
        placeholder="Введите название материала"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => validate()}
        required
        error={errors.title}
      />

      <TextArea
        label="Описание"
        placeholder="Введите описание материала"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
        onBlur={() => validate()}
      />

      <InputWithLabelLight
        label="Ссылка"
        placeholder="https://example.com/"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
      />
      <SelectLight
        label="Сложность"
        value={newLevel}
        onChange={(e) => setNewLevel(Number(e.target.value))}
      >
        {new Array(5).fill(0).map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </SelectLight>
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
