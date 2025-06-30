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

  if (pages <= 1) return null;

  const getPageNumbers = () => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    const pageNumbers = [];
    const currentGroup = [page - 1, page, page + 1].filter(
      (p) => p >= 1 && p <= pages,
    );

    pageNumbers.push(1);

    if (currentGroup[0] > 2) {
      pageNumbers.push('...');
    }

    currentGroup.forEach((p) => {
      if (p > 1 && p < pages) {
        pageNumbers.push(p);
      }
    });

    if (currentGroup[currentGroup.length - 1] < pages - 1) {
      pageNumbers.push('...');
    }

    if (pages > 1) {
      pageNumbers.push(pages);
    }

    return [...new Set(pageNumbers)].sort((a, b) => {
      if (a === '...' || b === '...') return 0;
      return (a as number) - (b as number);
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className=" sm:flex-1 flex sm:items-center sm:justify-between">
        <div className="max-sm:hidden">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{(page - 1) * limit + 1}</span> из
            <span className="font-medium">
              {' '}
              {Math.min(page * limit, count)}
            </span>{' '}
            всего <span className="font-medium">{count}</span>
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber as number)}
                  aria-current="page"
                  className={cva(
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    {
                      'z-10 bg-indigo-50 border-indigo-500 text-indigo-600':
                        pageNumber === page,
                    },
                  )}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              onClick={handleNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === pages}
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
