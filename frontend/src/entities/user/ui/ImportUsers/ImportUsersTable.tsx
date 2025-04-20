import { TableHeading } from '@/widgets/TableHeading';
import { ImportUsersRowType, ImportUsersStateType } from './types';
import { TableBody } from '@/widgets/TableBody';
import { usersApi } from '@/shared/api/usersApi';
import { cva } from '@/shared/lib/cva';
import Tooltip from '@/shared/ui/Tooltip';
import { Dispatch, SetStateAction } from 'react';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { TrashIcon } from '@heroicons/react/outline';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';

interface ImportUsersTablrProps {
  rows: ImportUsersRowType[];
  specs: string[];
  teams: string[];
  setRows: Dispatch<SetStateAction<ImportUsersStateType>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ImportUsersTable({
  rows,
  specs,
  teams,
  setRows,
  isLoading,
  onSubmit,
}: ImportUsersTablrProps) {
  const { data: usersData, isLoading: usersLoading } =
    usersApi.useGetUsersQuery({});

  const newSpecs = specs.filter((s) => s.trim() !== '-' && s.trim() !== '');
  const newTeams = teams.filter((t) => t.trim() !== '-' && t.trim() !== '');

  return (
    <>
      <div
        className={cva('flex flex-col gap-3 overflow-x-auto sm:-mx-6 -mx-4', {
          'animate-pulse pointer-events-none': usersLoading,
        })}
      >
        <table className="w-full">
          <TableHeading
            headings={[
              { label: 'Имя пользователя', className: 'pl-12' },
              'Почта',
              'Команда',
              'Специализация',
              '',
            ]}
          />
          <TableBody
            data={rows}
            columnRender={[
              {
                render: (_, index) =>
                  usersData?.users.find(
                    (u) => u.username === rows[index].Ник,
                  ) ? (
                    <Tooltip content="Имя пользователя занято" position="top">
                      <span className="text-red-500 text-sm font-medium">
                        {rows[index].Ник}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className="text-gray-800 text-sm font-medium">
                      {rows[index].Ник}
                    </span>
                  ),
                className: 'pl-12',
              },
              {
                render: (_, index) =>
                  usersData?.users.find(
                    (u) =>
                      u.email.toLowerCase() === rows[index].Почта.toLowerCase(),
                  ) ? (
                    <Tooltip content="Почта занята" position="top">
                      <span className="text-red-500 text-sm font-medium">
                        {rows[index].Почта}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className="text-gray-800 text-sm font-medium">
                      {rows[index].Почта}
                    </span>
                  ),
              },
              {
                render: (_, index) => (
                  <span className="text-gray-500 text-sm font-medium">
                    {rows[index].Департамент}
                  </span>
                ),
              },
              {
                render: (_, index) => (
                  <span className="text-gray-500 text-sm font-medium">
                    {rows[index].Направление}
                  </span>
                ),
              },
              {
                render: (_, index) => (
                  <SecondaryButton
                    onClick={() =>
                      setRows((prev) => ({
                        ...prev!,
                        data: prev!.data.filter((_, i) => i !== index),
                      }))
                    }
                    className="w-8 h-8 p-0 flex items-center justify-center rounded-md"
                  >
                    <TrashIcon className="h-5 w-5 " />
                  </SecondaryButton>
                ),
              },
            ]}
          />
        </table>
        {newSpecs.length > 0 && (
          <div className="sm:px-6 px-4 mt-2 flex gap-2 flex-wrap text-sm font-medium">
            Специцфикации к созданию:{' '}
            {newSpecs.map((s, index) => (
              <span key={index} className="text-gray-700 font-normal">
                {s}
              </span>
            ))}
          </div>
        )}

        {newTeams.length > 0 && (
          <div className="sm:px-6 px-4 mt-2 flex gap-2 flex-wrap text-sm font-medium">
            Команды к созданию:{' '}
            {newTeams.map((t, index) => (
              <span key={index} className="text-gray-700 font-normal">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {rows.length > 0 && (
        <PrimaryButton
          onClick={onSubmit}
          className="mt-4 w-full"
          disabled={usersLoading || isLoading}
        >
          {usersLoading || isLoading
            ? 'Загрузка...'
            : 'Импортировать пользователей'}
        </PrimaryButton>
      )}
    </>
  );
}
