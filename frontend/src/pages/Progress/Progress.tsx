import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SelfRateTab from './ui/SelfRateTab/SelfRateTab';
import AssignedRatesTab from './ui/AssignedRatesTab/AssignedRatesTab';
import ConfirmListTab from './ui/ConfirmListTab/ConfirmListTab';
import { memo, useMemo } from 'react';
import { Badge } from '@/shared/ui/Badge';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { NotificationType } from '@/entities/notifications';
import { rate360Api } from '@/shared/api/rate360Api';

const notifTypes: NotificationType[] = [
  'RATE_ASSIGNED_SELF',
  'RATE_ASSIGNED',
  'RATE_CONFIRM',
];

export default memo(function Progress() {
  const { data: rateAssigned } = rate360Api.useAssignedRatesQuery();
  const { data: confirmByUser } = rate360Api.useConfirmByUserQuery();
  const { data: confirmByCurator } = rate360Api.useConfirmByCuratorQuery();
  const { data: selfNotifs } = rate360Api.useSelfRatesQuery();

  useReadNotifsOnClose(notifTypes);

  const tabs = useMemo(() => {
    const confirm =
      (confirmByUser?.length ?? 0) + (confirmByCurator?.length ?? 0);

    return [
      {
        name: 'Самооценка 360',
        element:
          !selfNotifs || selfNotifs.length === 0 ? (
            'Самооценка 360'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              Самооценка 360{' '}
              <Badge color={'red'}>
                {selfNotifs.filter((r) => !r.finished).length}
              </Badge>
            </div>
          ),
        key: 'self-assessment',
      },
      {
        name: 'По другим пользователям',
        element:
          !rateAssigned || rateAssigned.length === 0 ? (
            'По другим пользователям'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              По другим пользователям{' '}
              <Badge color={'red'}>
                {rateAssigned.filter((r) => !r.finished).length}
              </Badge>
            </div>
          ),
        key: 'by-others',
      },
      {
        name: 'Утвердить список',
        element:
          confirm === 0 ? (
            'Утвердить список'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              Утвердить список <Badge color={'red'}>{confirm}</Badge>
            </div>
          ),
        key: 'confirm-list',
      },
    ];
  }, [rateAssigned, confirmByUser, confirmByCurator, selfNotifs]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabClassName="first:ml-4"
        className="max-sm:mr-16 max-sm:p-2"
        tabs={tabs}
        setCurrentTab={setTab}
        currentTab={activeTab}
      />
      {activeTab === 'self-assessment' && <SelfRateTab />}
      {activeTab === 'by-others' && <AssignedRatesTab />}
      {activeTab === 'confirm-list' && <ConfirmListTab />}
    </div>
  );
});
