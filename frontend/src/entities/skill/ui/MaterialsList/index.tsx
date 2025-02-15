import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  MinusCircleIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { MaterialsListForm } from './MaterialsListForm';
import { Material } from '@/entities/material';
import { CompetencyType } from '../../types/types';
import { skillsApi } from '@/shared/api/skillsApi';
import { useDispatch } from 'react-redux';
import { setModalData } from '@/app/store/modalSlice';

interface MaterialsListData {
  materials: { material: Material }[];
  name: string;
  id: number;
  type: CompetencyType;
}

interface MaterialsListProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

type Form = {
  open: boolean;
  type: 'ADD' | 'EDIT';
  parentId?: number;
  parentType?: CompetencyType;
} & Partial<Material>;

const defaultForm: Form = {
  open: false,
  type: 'ADD',
};

export default function MaterialsList({
  isOpen,
  modalData,
  closeModal,
}: MaterialsListProps) {
  const [form, setForm] = useState<Form>(defaultForm);
  const { name, materials, id, type } = modalData as MaterialsListData;
  const [removeMaterial, { isLoading }] = skillsApi.useRemoveMaterialMutation();
  const dispatch = useDispatch();

  const editMaterial = (data: Material) => {
    setForm({
      open: true,
      type: 'EDIT',
      ...data,
    });
  };

  const deleteMaterial = (id: number) => {
    removeMaterial({ id });
    const data = { name, materials, id };
    data.materials = data.materials.filter((item) => item.material.id !== id);
    dispatch(setModalData(data));
  };

  const addNewMaterial = () => {
    setForm({
      open: true,
      type: 'ADD',
      parentId: id,
      parentType: type,
    });
  };

  const closeForm = () => {
    setForm(defaultForm);
  };

  return (
    <Modal
      footer={false}
      className="sm:max-w-[calc(100%-40px)]"
      open={isOpen}
      setOpen={closeModal}
      title="Профиль специализации"
      //   onSubmit={blockSubmit}
      submitText="Добавить"
      childrenFlex={false}
      loading={isLoading}
    >
      <div className="">
        <p className="text-gray-400">
          Название: <span className="text-gray-700">{name}</span>
        </p>
        <div className="flex mt-10 justify-between">
          <h3 className="font-bold">
            Общие материалы для развития по специализации
          </h3>
          <SoftButton className="space-2" onClick={addNewMaterial}>
            <PlusCircleIcon className="h-5 w-5" />
            Добавить
          </SoftButton>
        </div>
        <div className="overflow-x-auto w-full mt-5">
          <table className="w-full">
            <thead>
              <tr className="border-gray-300 border-b">
                <th className="p-3 text-left text-sm font-semibold text-gray-600 ">
                  <div className="w-[380px]">Название</div>
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 ">
                  <div className="w-[380px]">Описание</div>
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 ">
                  <div className="w-[258px]">Ссылка</div>
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 ">
                  <div className="w-[220px]">Тип материала</div>
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 ">
                  <div className="w-[83px]">Действия</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {materials.map((row) => {
                return (
                  <tr
                    key={row.material.id}
                    className=" border-b border-gray-300"
                  >
                    <td className="p-3 text-sm text-gray-700">
                      {row.material.name ?? '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {row.material.description ?? '-'}
                    </td>
                    <td className="p-3 text-sm text-indigo-700">
                      {row.material.url ?? '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {row.material.contentType ?? '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <SoftButton
                          className="rounded-full p-2"
                          size="xs"
                          onClick={() => editMaterial(row.material)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </SoftButton>
                        <SoftButton
                          className="rounded-full p-2"
                          size="xs"
                          onClick={() => deleteMaterial(row.material.id)}
                        >
                          <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
                        </SoftButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {form.open && <MaterialsListForm closeForm={closeForm} {...form} />}
      </div>
    </Modal>
  );
}
