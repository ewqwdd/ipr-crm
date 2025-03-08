import { useLoading } from '@/app/hooks/useLoading';
import { IprTable } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { Heading } from '@/shared/ui/Heading';
import { useEffect } from 'react';

export default function IprList() {
  const { data, isLoading } = iprApi.useFindAllIprQuery();

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
    <div className="px-8 py-10 flex flex-col">
      <Heading title="Планы развития" description="Список планов развития" />
      {data && <IprTable ipr={data} isLoading={isLoading} />}
    </div>
  );
}
