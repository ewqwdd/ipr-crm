import { cva } from '@/shared/lib/cva';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  count?: number;
}

export default function Pagination({
  page,
  setPage,
  limit,
  count = 0,
}: PaginationProps) {
  const pages = Math.ceil(count / limit);

  const handlePrevPage = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page === pages) return;
    setPage(page + 1);
  };

  if (pages === 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{(page - 1) * limit}</span> of{' '}
            <span className="font-medium">{count}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={handlePrevPage}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {new Array(pages).fill(0).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setPage(index + 1)}
                aria-current="page"
                className={cva(
                  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  {
                    'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':
                      index + 1 === page,
                  },
                )}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
