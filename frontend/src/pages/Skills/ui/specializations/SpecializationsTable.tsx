import { useModal } from '@/app/hooks/useModal';
import { universalApi } from '@/shared/api/universalApi';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';
import { MinusCircleIcon, PencilIcon } from '@heroicons/react/outline';
import { FC } from 'react';

type Specialization = {
  id: number;
  name: string;
  materials: number;
  description: string;
};

// const data: Specialization[] = [
//   {
//     id: 1,
//     name: 'Frontend Frontend Frontend Frontend Frontend',
//     materials: 8,
//     description: 'Frontend description',
//   },
//   {
//     id: 2,
//     name: 'Backend Backend Backend Backend Backend',
//     materials: 2,
//     description: 'Backend description',
//   },
//   {
//     id: 3,
//     name: 'Devops Devops Devops Devops Devops',
//     materials: 0,
//     description: 'Devops description',
//   },
// ];

const materialsButtonClassName =
  'border-b border-dashed text-indigo-600 border-indigo-600 hover:text-indigo-500 hover:border-indigo-500 h-6';
const materialsButtonEmptyClassName = 'hover:text-indigo-500';

const SpecializationsTable: FC = () => {
  const { openModal } = useModal();
  const { data } = universalApi.useGetSpecsQuery();

  //   const openMatreialsModal = ({ id }: { id: number }) => {
  //     console.log('openMatreialsModal', { id });
  //     // openModal('MATERIALS', { id });
  //   };
  //   const editSpecialization = ({
  //     id,
  //     name,
  //     description,
  //   }: {
  //     id: number;
  //     name: string;
  //     description: string;
  //   }) => {
  //     console.log('editSpecialization', { id, name, description });
  //     openModal('EDIT_SPECIALIZATION', { id, name, description });
  //   };
  //   const deleteSpecialization = ({ id }: { id: number }) => {
  //     openModal('CONFIRM', { onSubmit: () => console.log('delete => ', id) });
  //     // console.log('deleteSpecialization', { id, description });
  //   };

  console.log('data', data);

  const selectSpecialization = ({ id }: { id: number }) => {
    console.log('selectSpecialization', { id });
    //
  };

  //   const openModalMaterials = ({ id }: { id: number }) => {
  //     openModal('MATERIALS', { id });
  //   };

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b border-gray-300 p-2 text-left">
              <div className="w-[160px]">Название</div>
            </th>
            <th className="border-b border-gray-300 p-2 text-center">
              <div className="w-[102px]">Активно</div>
            </th>
            <th className="border-b border-gray-300 p-2 text-center">
              <div className="w-[70px]">PR</div>
            </th>
            <th className="border-b border-gray-300 p-2 text-center">
              <div className="w-[150px]">Материалы</div>
            </th>
            <th className="border-b border-gray-300 p-2 text-center">
              <div className="w-[70px]">Действия</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-200 cursor-pointer border-b border-gray-300"
              onClick={() => selectSpecialization({ id: row.id })}
            >
              <td className=" p-2">
                <div className="hover:text-indigo-600">{row.name}</div>
              </td>
              <td className=" p-2 text-center">
                <Checkbox
                  className="justify-center"
                  checked={true}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    console.log('Checkbox');
                  }}
                />
              </td>
              <td className=" p-2 text-center">
                <Checkbox
                  className="justify-center"
                  checked={true}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    console.log('Checkbox');
                  }}
                />
              </td>
              <td className=" p-2 text-center">
                <button
                  className={
                    !row?.materials || row?.materials === 0
                      ? materialsButtonEmptyClassName
                      : materialsButtonClassName
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Possible add materials
                    openModal('MATERIALS_LIST', { id: row.id, name: row.name });
                  }}
                >
                  {!row?.materials || row?.materials === 0
                    ? 'Без материала'
                    : `${row?.materials} материалов`}
                </button>
              </td>
              <td className=" p-2 text-center">
                <div className="flex gap-2">
                  <SoftButton
                    className="rounded-full p-2"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('EDIT_SPECIALIZATION', {
                        id: row.id,
                        name: row.name,
                        description: row?.description,
                      });
                    }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </SoftButton>
                  <SoftButton
                    size="xs"
                    className="rounded-full text-red p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal('CONFIRM', {
                        onSubmit: () => console.log('delete => ', row.id),
                      });
                      //   deleteSpecialization({
                      //     id: row.id,
                      //   });
                    }}
                  >
                    <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
                  </SoftButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecializationsTable;
