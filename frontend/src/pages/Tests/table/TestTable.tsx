import { Test } from '@/entities/test';
import { Pagination } from '@/shared/ui/Pagination';
import { useState } from 'react';
import TestTableFilter from './TestTableFilter';
// import { initialFilters } from "./helpers";
import Row from './Row';

type TestTableProps = {
  tests: Test[];
};

const LIMIT = 10;

const TestTable = ({ tests }: TestTableProps) => {
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [filteredData, setFilteredData] = useState<Test[]>(tests);
  // const [filters, setFilters] = useState(initialFilters);

  console.log('tests => ', tests);

  const paginateddata = tests.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div>
      <TestTableFilter tests={tests} />
      <table className="min-w-full divide-y divide-gray-300 mt-5">
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
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Название теста
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
            ></th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              {/* <span className="sr-only"> */}
              Действия
              {/* </span> */}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginateddata.map((test) => (
            <Row key={test?.id} {...test} />
          ))}
        </tbody>
      </table>
      <Pagination
        count={tests?.length}
        limit={LIMIT}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default TestTable;
