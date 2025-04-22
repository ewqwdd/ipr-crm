import { rate360Api } from '@/shared/api/rate360Api';
import Report360 from './Report360';

interface FetchingReportProps {
  id: string;
}

export default function FetchingReport({ id }: FetchingReportProps) {
  const { data, isLoading, isError } = rate360Api.useFindReportQuery(
    parseInt(id ?? ''),
    {
      skip: !id,
    },
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Отчет недоступен</h1>
        <p className="text-gray-500">Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }

  return <Report360 isLoading={isLoading} rate={data} />;
}
