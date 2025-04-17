import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';
import SelfRateTab from './ui/SelfRateTab/SelfRateTab';
import AssignedRatesTab from './ui/AssignedRatesTab/AssignedRatesTab';
import ConfirmListTab from './ui/ConfirmListTab/ConfirmListTab';
import { memo, useMemo } from 'react';
import { useAppSelector } from '@/app';
import { Badge } from '@/shared/ui/Badge';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { NotificationType } from '@/entities/notifications';

const notifTypes: NotificationType[] = [
  'RATE_ASSIGNED_SELF',
  'RATE_ASSIGNED',
  'RATE_CONFIRM',
];

export default memo(function Progress() {
  const notifications = useAppSelector(
    (state) => state.user.user?.notifications,
  );

  useReadNotifsOnClose(notifTypes);

  const tabs = useMemo(() => {
    const selfNotifs = notifications?.filter(
      (notif) => notif.type === 'RATE_ASSIGNED_SELF' && !notif.watched,
    ).length;
    const rateAssigned = notifications?.filter(
      (notif) => notif.type === 'RATE_ASSIGNED' && !notif.watched,
    ).length;
    const rateConfirm = notifications?.filter(
      (notif) => notif.type === 'RATE_CONFIRM' && !notif.watched,
    ).length;

    return [
      {
        name: 'Самооценка 360',
        element:
          selfNotifs === 0 ? (
            'Самооценка 360'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              Самооценка 360 <Badge color={'red'}>{selfNotifs}</Badge>
            </div>
          ),
        key: 'self-assessment',
      },
      {
        name: 'По другим пользователям',
        element:
          rateAssigned === 0 ? (
            'По другим пользователям'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              По другим пользователям{' '}
              <Badge color={'red'}>{rateAssigned}</Badge>
            </div>
          ),
        key: 'by-others',
      },
      {
        name: 'Утвердить список',
        element:
          rateConfirm === 0 ? (
            'Утвердить список'
          ) : (
            <div className="flex items-center gap-2 [&>span]:rounded-full [&>span]size-4">
              Утвердить список <Badge color={'red'}>{rateConfirm}</Badge>
            </div>
          ),
        key: 'confirm-list',
      },
    ];
  }, [notifications]);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || tabs[0].key;
  const setTab = (tab: string) => {
    setSearchParams(`?tab=${tab}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        tabClassName="first:ml-4"
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
