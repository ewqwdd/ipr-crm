import { useModal } from '@/app/hooks/useModal';
import { foldersApi } from '@/shared/api/foldersApi';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { StructureFoldersList } from '@/widgets/StructureFoldersList';
import { FolderIcon } from '@heroicons/react/outline';
import { useState } from 'react';

export default function FoldersWrapper() {
  const { data, isLoading, isFetching } =
    foldersApi.useGetProductFoldersQuery();
  const { openModal } = useModal();
  const [search, setSearch] = useState('');

  const searchLower = search.toLowerCase();

  const filtered =
    search.length > 0
      ? data
          ?.map((folder) => ({
            ...folder,
            teams:
              folder.teams
                ?.map((team) => ({
                  ...team,
                  specs:
                    team.specs?.filter((spec) =>
                      spec.name.toLowerCase().includes(searchLower),
                    ) ?? [],
                }))
                .filter(
                  (team) =>
                    team.specs.length > 0 ||
                    team.name.toLowerCase().includes(searchLower),
                ) ?? [],
          }))
          .filter(
            (folder) =>
              folder.teams.length > 0 ||
              folder.name.toLowerCase().includes(searchLower),
          )
      : data;

  return (
    <>
      <div className="flex justify-between gap-4 max-sm:flex-col max-sm:mt-6 my-2">
        <InputWithLabelLight
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <PrimaryButton onClick={() => openModal('ADD_PRODUCT_FOLDER')}>
          Добавить продукт
        </PrimaryButton>
      </div>

      <div className="flex gap-4 mt-4 justify-end">
        <div className="flex gap-1 items-center max-sm:text-sm">
          <FolderIcon className="h-5 w-5 text-blue-500" />
          Продукт
        </div>
        <div className="flex gap-1 items-center max-sm:text-sm">
          <FolderIcon className="h-5 w-5 text-green-500" />
          Команда
        </div>
        <div className="flex gap-1 items-center max-sm:text-sm">
          <FolderIcon className="h-5 w-5 text-purple-500" />
          Специализация
        </div>
      </div>

      {data && (
        <StructureFoldersList
          data={filtered}
          loading={isLoading || isFetching}
        />
      )}
      {isLoading && (
        <div className="grow flex flex-col mt-4">
          {new Array(5).fill(0).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-14 my-2 mb-2 rounded-md"
            ></div>
          ))}
        </div>
      )}
    </>
  );
}
