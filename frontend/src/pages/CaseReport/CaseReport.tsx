import { caseApi } from '@/shared/api/caseApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { cva } from '@/shared/lib/cva';
import { generalService } from '@/shared/lib/generalService';
import { Avatar } from '@/shared/ui/Avatar';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useParams } from 'react-router';

export default function CaseReport() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = caseApi.useGetReportQuery(id ?? '');
  const isAdmin = useIsAdmin();

  return (
    <LoadingOverlay fullScereen active={isLoading}>
      <div className="sm:px-8 sm:py-10 px-4 py-6 flex flex-col sm:h-full gap-6">
        <div>
          <Heading title="Отчет" description="Отчет пройденного кейса" />
        </div>
        {data?.cases.map((item) => (
          <div className="flex flex-col gap-2">
            <div
              key={item.id}
              className={cva(
                'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
              )}
            >
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <th
                    scope="col"
                    className="pl-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-full"
                  >
                    {item.name}
                  </th>
                  <th
                    scope="col"
                    className="pr-4 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    Оценка
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td className="whitespace-nowrap pl-4 py-2 text-sm font-semibold">
                      Средняя оценка
                    </td>
                    <td className="whitespace-nowrap pr-4 py-2 text-sm text-center font-semibold">
                      {item.avg}
                    </td>
                  </tr>
                  {isAdmin &&
                    data.evaluators.map((evaluator) => (
                      <tr className="text-gray-800" key={evaluator.userId}>
                        <td className="whitespace-nowrap pl-4 py-2 text-sm">
                          {evaluator.user.username}
                        </td>
                        <td className="whitespace-nowrap pr-4 py-2 text-sm text-center font-semibold">
                          {data.userRates.find(
                            (rate) =>
                              rate.userId === evaluator.userId &&
                              rate.caseId === item.id,
                          )?.rate ?? 'N/D'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {isAdmin &&
              data.userRates
                .filter((rate) => rate.caseId === item.id && rate.comment)
                .map((rate) => (
                  <div className="flex gap-2 border-b-gray-200 borderя-b last:border-b-0 pb-4">
                    <Avatar
                      src={generalService.transformFileUrl(rate.user?.avatar)}
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="tetx-gray-900 font-semibold">
                        {rate.user?.username}
                      </h3>
                      <p className="text-gray-600 text-sm">{rate.comment}</p>
                    </div>
                  </div>
                ))}
          </div>
        ))}
        {data && data?.comments.length > 0 && (
          <>
            <div className="mt-6 pt-6 border-t border-t-gray-200 flex flex-col gap-2">
              <h2 className="font-semibold text-gray-900">Комментарии</h2>
              {data.comments.map((comment) => (
                <p className="text-gray-800 text-sm">{comment.comment}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </LoadingOverlay>
  );
}
