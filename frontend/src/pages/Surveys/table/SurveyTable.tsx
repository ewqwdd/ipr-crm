import { Pagination } from '@/shared/ui/Pagination';
import { useCallback, useState } from 'react';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { DateObject } from 'react-multi-date-picker';
import { cva } from '@/shared/lib/cva';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
  initialFilters,
  TestTableFilter,
  TestTableFilterType,
} from '@/widgets/TestTableFilter';
import { Survey } from '@/entities/survey';
import Row from './Row';

type SurveyTableProps = {
  surveys: Survey[];
  isFetching?: boolean;
};

const LIMIT = 10;

const SurveyTable = ({ surveys, isFetching }: SurveyTableProps) => {
  const [page, setPage] = useState(1);
  const isAdmin = useIsAdmin();
  const [filters, setFilters] = useState<TestTableFilterType>(initialFilters);

  const updateFilters = useCallback(
    (key: keyof TestTableFilterType, value: unknown) => {
      setFilters((prevFilters: TestTableFilterType) => ({
        ...prevFilters,
        [key]: value,
      }));
    },
    [],
  );

  const filteredTests = surveys.filter((survey) => {
    if (
      filters.name &&
      !survey.name?.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }

    if (filters.status !== 'ALL') {
      const isHidden = survey.hidden ?? true;
      if (filters.status === 'VISSIBLE' && isHidden) return false;
      if (filters.status === 'HIDDEN' && !isHidden) return false;
    }

    if (filters.period) {
      const period = filters.period as DateObject[];
      if (period.length === 2) {
        const [start, end] = period;
        const deadline = survey.endDate ? new Date(survey.endDate) : null;

        if (!deadline) return false;

        const filterStart = new Date(
          start.year,
          start.month.number - 1,
          start.day,
        );
        const filterEnd = new Date(end.year, end.month.number - 1, end.day);

        if (deadline <= filterStart || deadline >= filterEnd) {
          return false;
        }
      }
    }

    return true;
  });

  const paginateddata = filteredTests.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div
      className={cva('flex flex-col h-full', { 'animate-pulse': !!isFetching })}
    >
      <TestTableFilter filters={filters} updateFilters={updateFilters} />
      {filteredTests.length > 0 ? (
        <div className="w-full max-sm:overflow-x-auto">
          <table
            className={`min-w-[800px] w-full divide-y divide-gray-300 mt-5`}
          >
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Информация
                </th>
                <th
                  scope="col"
                  className="w-full px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Название теста
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Дедлайн
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginateddata.map((test) => (
                <Row key={test?.id} isAdmin={isAdmin} {...test} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState />
      )}
      {filteredTests.length > 0 && (
        <Pagination
          count={filteredTests.length}
          limit={LIMIT}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default SurveyTable;
