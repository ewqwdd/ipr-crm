import { IprTable } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function IprList() {
  const { data, isLoading } = iprApi.useFindAllIprQuery();

  // TODO: replace loading

  return (
    <LoadingOverlay active={isLoading}>
      <div className="px-8 py-10 flex flex-col">
        <Heading title="Планы развития" description="Список планов развития" />
        {data && <IprTable ipr={data} isLoading={isLoading} />}
      </div>
    </LoadingOverlay>
  );
}
