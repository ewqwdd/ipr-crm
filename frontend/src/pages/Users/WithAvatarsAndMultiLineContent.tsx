import { usersApi } from '@/shared/api/usersApi';
import TableRow from './TableRow';
import { cva } from '@/shared/lib/cva';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Pagination } from '@/shared/ui/Pagination';
import UsersFilters, { applyUsersFilters } from './usersFilters';
import { User } from '@/entities/user';
import { Filters, initialFilters } from './usersFilters/constants';

const LIMIT = 8;

export default function WithAvatarsAndMultiLineContent() {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = usersApi.useGetUsersQuery({});
  const [filteredData, setFilteredData] = useState<User[]>([]);

  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilters = useCallback((key: keyof Filters, value: unknown) => {
    setFilters((prevFilters: Filters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

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
    if (paginateddata.length === 0 && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [filteredData, page, paginateddata.length]);

  return (
    <>
      <UsersFilters
        data={data?.users}
        filters={filters}
        updateFilters={updateFilters}
      />
      <div
        className={cva(
          'sm:overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
        )}
      >
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
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
                    Подразделение
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
                    />
                  ))}
                {isLoading &&
                  !data &&
                  new Array(LIMIT)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow edit={false} key={index} person={{}} />
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
