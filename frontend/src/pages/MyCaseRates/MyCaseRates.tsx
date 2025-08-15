import { caseApi } from '@/shared/api/caseApi';
import { dateService } from '@/shared/lib/dateService';
import { Card } from '@/shared/ui/Card';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { BriefcaseIcon } from '@heroicons/react/outline';

export default function MyCaseRates() {
  const { data, isLoading } = caseApi.useGetMyCaseRatesQuery();

  return (
    <LoadingOverlay fullScereen active={isLoading}>
      <div className="sm:px-8 sm:py-10 p-3 flex flex-col h-full relative">
        <div>
          <Heading title="Пройденные кейсы" />
        </div>
        <div className="flex flex-col gap-3">
          {data?.map((item) => (
            <Card key={item.id} className="[&>div]:py-2.5 [&>div]:px-4">
              <div className="flex gap-2 items-center text-smz">
                <BriefcaseIcon className="size-9 text-indigo-600 rounded-full bg-indigo-100 p-2" />
                <span className="font-semibold">
                  {(
                    item.cases.reduce((acc, item) => acc + (item.avg ?? 0), 0) /
                    item.cases.length
                  ).toFixed(1)}
                </span>
                {item.startDate && (
                  <span className="ml-auto text-gray-600 font-medium">
                    Дата: {dateService.formatDate(item.startDate)}
                  </span>
                )}
              </div>
              {item.comments.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-4 text-sm">
                  <span className="text-gray-600  text-sm">Комментарии:</span>
                  <ul className="flex flex-col gap-1 list-inside list-disc">
                    {item.comments.map((item) => (
                      <li className="text-gray-800 font-medium">
                        {item?.comment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </LoadingOverlay>
  );
}
