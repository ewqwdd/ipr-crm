import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  MinusCircleIcon,
  PencilIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { MaterialsListForm, MaterialType } from './MaterialsListForm';

interface MaterialsListProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

type Material = {
  id: number;
  name: string;
  link: string;
  type: MaterialType;
};

const materials: Material[] = [
  {
    id: 1,
    name: 'Материал 1',
    link: 'http://google.com',
    type: 'VIDEO',
  },
  {
    id: 2,
    name: 'Материал 2',
    link: 'http://google.com',
    type: 'BOOK',
  },
  {
    id: 3,
    name: 'Материал 3',
    link: 'http://google.com',
    type: 'COURSE',
  },
];

type Form = {
  open: boolean;
  type: 'ADD' | 'EDIT';
  name?: string;
  link?: string;
  materialType?: MaterialType;
  id?: number;
};

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
  const { name } = modalData as {
    name: string;
  };

  //   const [createCompetencyBlock, blockProps] =
  //     skillsApi.useCreateCompetencyBlockMutation();

  const editMaterial = ({
    id,
    name,
    link,
    materialType,
  }: {
    id: number;
    name: string;
    link: string;
    materialType: MaterialType;
  }) => {
    setForm({
      open: true,
      type: 'EDIT',
      id,
      name,
      link,
      materialType,
    });
  };

  const deleteMaterial = (id: number) => {
    // TODO: add api call
    console.log('delete material', id);
  };

  const addNewMaterial = () => {
    setForm({
      open: true,
      type: 'ADD',
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
      //   loading={blockProps.isLoading}
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
                  <tr key={row.id} className=" border-b border-gray-300">
                    <td className="p-3 text-sm text-gray-700">{row.name}</td>
                    <td className="p-3 text-sm text-indigo-700">{row.link}</td>
                    <td className="p-3 text-sm text-gray-700">{row.type}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <SoftButton
                          className="rounded-full p-2"
                          size="xs"
                          onClick={() =>
                            editMaterial({
                              id: row.id,
                              name: row.name,
                              link: row.link,
                              materialType: row.type,
                            })
                          }
                        >
                          <PencilIcon className="h-5 w-5" />
                        </SoftButton>
                        <SoftButton
                          className="rounded-full p-2"
                          size="xs"
                          onClick={() => deleteMaterial(row.id)}
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
