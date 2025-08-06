import { usersApi } from '@/shared/api/usersApi/usersApi';
import TableRow from './TableRow';
import { cva } from '@/shared/lib/cva';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Pagination } from '@/shared/ui/Pagination';
import UsersFilters, { applyUsersFilters } from './usersFilters';
import { initialUserFilters, User, UsersFilter } from '@/entities/user';
import { useSearchState } from '@/shared/hooks/useSearchState';
import { teamsApi } from '@/shared/api/teamsApi';

const LIMIT = 8;

export default function WithAvatarsAndMultiLineContent() {
  const { data, isLoading: usersLoading } = usersApi.useGetUsersQuery();
  const { data: teams, isLoading: teamsLoading } = teamsApi.useGetTeamsQuery();
  const [filteredData, setFilteredData] = useState<User[]>([]);

  const [filters, setFilters, inited] =
    useSearchState<UsersFilter>(initialUserFilters);
  const prevFilters = useRef<UsersFilter>();

  const page = filters.page;
  const setPage = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useLayoutEffect(() => {
    setFilteredData(data?.users || []);
  }, [data?.users]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const users = data?.users || [];
      const filtered = users.filter((user) => {
        return applyUsersFilters(user, filters);
      });
      setFilteredData(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, data?.users]);

  const paginateddata = filteredData.slice((page - 1) * LIMIT, page * LIMIT);

  useEffect(() => {
    if (
      inited &&
      filters.page !== 1 &&
      prevFilters.current &&
      prevFilters.current.page === filters.page
    ) {
      setPage(1);
    }
    return () => {
      prevFilters.current = filters;
    };
  }, [filters]);

  const activeUsers = useMemo(() => {
    return data?.users.filter((user) => user.access) || [];
  }, [data]);

  const isLoading = usersLoading || teamsLoading;

  return (
    <>
      <div className="flex mb-4 text-sm text-gray-700">
        Активных пользователей:{' '}
        <span className="ml-2 font-semibold">
          {activeUsers.length} из {data?.count ?? 0}
        </span>
      </div>

      <UsersFilters
        data={data?.users}
        filters={filters}
        setFilters={setFilters}
      />
      <div
        className={cva(
          'sm:overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
        )}
      >
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
            <table className="w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Имя
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Имя пользователя
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Продукт
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Департамент
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Направление
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Группа
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Специализации
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Редактировать</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {!isLoading &&
                  data &&
                  paginateddata.map((person, index) => (
                    <TableRow
                      key={person.id}
                      person={person}
                      last={index === paginateddata.length - 1}
                      teams={teams?.list}
                    />
                  ))}
                {isLoading &&
                  !data &&
                  new Array(LIMIT)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow skeleton edit={false} key={index} person={{}} />
                    ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          count={filteredData?.length}
          limit={LIMIT}
          page={page}
          setPage={setPage}
        />
      </div>
    </>
  );
}
