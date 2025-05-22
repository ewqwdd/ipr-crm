import { useModal } from '@/app/hooks/useModal';
import { Spec } from '@/entities/user';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { FC, useMemo } from 'react';
import SpecializationTableSkeleton from './SpecializationTableSkeleton';
import SpecializationTableItem from './SpecializationTableItem';

interface ISpecializationsTableProps {
  selectedSpec: number | null;
  setSelectedSpec: React.Dispatch<React.SetStateAction<number | null>>;
  search?: string;
}

const SpecializationsTable: FC<ISpecializationsTableProps> = ({
  selectedSpec,
  setSelectedSpec,
  search,
}) => {
  const { openModal } = useModal();
  const { data, isFetching } = universalApi.useGetSpecsQuery();
  const [deleteFn, { isLoading }] = universalApi.useDeleteSpecMutation();

  const selectSpecialization = (data: Spec) => {
    setSelectedSpec(data.id);
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.name.toLowerCase().includes(search?.toLowerCase() || ''),
    );
  }, [search, data]);

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
            {filtered?.map((row) => (
              <SpecializationTableItem
                key={row.id}
                row={row}
                selectedSpec={selectedSpec}
                selectSpecialization={selectSpecialization}
                deleteFn={deleteFn}
                openModal={openModal}
              />
            ))}
            {isFetching && <SpecializationTableSkeleton />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecializationsTable;
