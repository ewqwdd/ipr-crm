import { rate360Api } from '@/shared/api/rate360Api';
import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import { Radio } from '@/shared/ui/Radio';
import { useState } from 'react';
import ConfirmListItem from '../ConfirmListItem/ConfirmListItem';

type RatesFilter = 'self' | 'curator';

export default function ConfirmListTab() {
  const confirmByUser = rate360Api.useConfirmByUserQuery();
  const confirmByCurator = rate360Api.useConfirmByCuratorQuery();
  const specs = universalApi.useGetSpecsQuery();
  const [ratesFilter, setRatesFilter] = useState<RatesFilter>('self');

  const listToShow =
    ratesFilter === 'self' ? confirmByUser.data : confirmByCurator.data;
  const loadingToShow =
    ratesFilter === 'self'
      ? confirmByUser.isLoading
      : confirmByCurator.isLoading;

  return (
    <div
      className={cva('flex flex-col gap-4 p-4', {
        'animate-pulse': loadingToShow,
      })}
    >
      <Heading title={'Утверждение взаимодействующих для оценки 360'} />
      <div className="flex items-center gap-4">
        <Radio
          checked={ratesFilter === 'self'}
          onChange={() => setRatesFilter('self')}
        >
          По себе
        </Radio>
        <Radio
          checked={ratesFilter === 'curator'}
          onChange={() => setRatesFilter('curator')}
        >
          По другим пользователям
        </Radio>
      </div>

      {listToShow?.map((rate) => (
        <ConfirmListItem
          specs={specs.data ?? []}
          rate={rate}
          curatorBlocked={ratesFilter === 'self'}
        />
      ))}
    </div>
  );
}
