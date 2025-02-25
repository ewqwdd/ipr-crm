import { IprTable } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import Dimmer from '@/shared/ui/Dimmer';
import { Heading } from '@/shared/ui/Heading';

export default function IprList() {
  const { data, isLoading } = iprApi.useFindAllIprQuery();

  return (
    <Dimmer active={isLoading}>
      <div className="px-8 py-10 flex flex-col">
        <Heading title="Планы развития" description="Список планов развития" />
        {data && <IprTable ipr={data} isLoading={isLoading} />}
      </div>
    </Dimmer>
  );
}
