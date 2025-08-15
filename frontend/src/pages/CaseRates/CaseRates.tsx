import { useModal } from '@/app/hooks/useModal';
import { caseApi } from '@/shared/api/caseApi';
import { dateService } from '@/shared/lib/dateService';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TableBody } from '@/widgets/TableBody';
import { TableHeading } from '@/widgets/TableHeading';
import { UsersIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

export default function CaseRates() {
  const { data, isLoading } = caseApi.useGetCaseRatesQuery();
  const { openModal } = useModal();

  return (
    <LoadingOverlay active={isLoading}>
      <div className="sm:px-8 sm:py-10 px-4 py-6 flex flex-col sm:h-full">
        <div className="flex max-sm:flex-col-reverse max-sm:gap-2 items-start">
          <Heading
            title="Опросы по кейсам"
            description={'Список поросов по кейсам'}
          />
          <PrimaryButton onClick={() => openModal('CREATE_CASE_RATE')}>
            Добавить опрос
          </PrimaryButton>
        </div>
        <div className="max-sm:max-w-full overflow-x-auto">
          <table className="sm:w-full divide-y divide-gray-300 mt-2">
            <TableHeading
              headings={[
                '',
                'Оцениваемый',
                'Автор',
                'Дата',
                'Количество кейсов',
                'Средняя оценка',
                'Оценивающие',
                '',
              ]}
            />
            <TableBody
              data={data || []}
              columnRender={[
                {
                  render: (_, i) => (
                    <span className="text-gray-900">{i + 1}</span>
                  ),
                },
                {
                  render: (item) => (
                    <Link
                      className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                      to={`/users/${item.user.id}`}
                    >
                      {item.user.username}
                    </Link>
                  ),
                },

                {
                  render: (item) =>
                    item.author ? (
                      <Link
                        className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                        to={`/users/${item.author?.id}`}
                      >
                        {item.author.username}
                      </Link>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Без автора
                      </span>
                    ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-500 font-medium">
                      {item.startDate && dateService.formatDate(item.startDate)}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-900 font-medium">
                      {item.cases.length}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <span className="text-gray-900 font-medium">
                      {item.cases.length > 0
                        ? (
                            item.cases.reduce(
                              (acc, rate) => acc + (rate.avg ?? 0),
                              0,
                            ) / item.cases.length
                          ).toFixed(1)
                        : 'Не оценено'}
                    </span>
                  ),
                },
                {
                  render: (item) => (
                    <SoftButton
                      onClick={() =>
                        openModal('CASE_EVALUATORS', { data: item })
                      }
                      className="size-10 p-0 rounded-full"
                    >
                      <UsersIcon className="size-5" />
                    </SoftButton>
                  ),
                },
                {
                  render: (item) => (
                    <Link
                      className="text-indigo-500 font-medium hover:text-indigo-700 transition-all"
                      to={`/case-report/${item.id}`}
                    >
                      Перейти
                    </Link>
                  ),
                },
              ]}
            />
          </table>
        </div>
      </div>
    </LoadingOverlay>
  );
}
