import { useModal } from '@/app/hooks/useModal';
import { Spec } from '@/entities/user';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';
import { MinusCircleIcon, PencilIcon } from '@heroicons/react/outline';
import { FC } from 'react';
import SpecializationTableSkeleton from './SpecializationTableSkeleton';

interface ISpecializationsTableProps {
  selectedSpec: number | null;
  setSelectedSpec: React.Dispatch<React.SetStateAction<number | null>>;
}

const SpecializationsTable: FC<ISpecializationsTableProps> = ({
  selectedSpec,
  setSelectedSpec,
}) => {
  const { openModal } = useModal();
  const { data, isFetching } = universalApi.useGetSpecsQuery();
  const [deleteFn, { isLoading }] = universalApi.useDeleteSpecMutation();

  const selectSpecialization = (data: Spec) => {
    setSelectedSpec(data.id);
  };

  return (
    <div
      className={cva('mt-10 overflow-x-auto', {
        'animate-pulse': isLoading,
      })}
    >
      <div
        className={cva('mt-10 overflow-x-auto', {
          'animate-pulse': isLoading,
        })}
      >
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
                <div className="w-[70px]">Действия</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-200 cursor-pointer border-b border-gray-300 ${selectedSpec === row.id ? 'bg-gray-200' : ''}`}
                onClick={() => selectSpecialization(row)}
              >
                <td className=" p-2">
                  <div
                    className={`hover:text-indigo-600 ${selectedSpec === row.id ? 'text-indigo-600' : ''}`}
                  >
                    {row.name}
                  </div>
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
                          onSubmit: () => deleteFn(row.id),
                        });
                      }}
                    >
                      <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
                    </SoftButton>
                  </div>
                </td>
              </tr>
            ))}
            {isFetching && <SpecializationTableSkeleton />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecializationsTable;
