import { useAppSelector } from '@/app';
import { NotificationType } from '@/entities/notifications';
import { iprApi } from '@/shared/api/iprApi';
import { useReadNotifsOnClose } from '@/shared/hooks/useReadNotifsOnClose';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { Board } from '@/widgets/Board';

const notifTypes: NotificationType[] = ['TASK_ASSIGNED'];

export default function BoardPage() {
  const { data, isLoading } = iprApi.useFindBoardQuery();
  const role = useAppSelector((state) => state.user.user?.role);
  const isAdmin = role?.name === 'admin';

  useReadNotifsOnClose(notifTypes);

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div
        className={cva('sm:px-8 py-10 flex flex-col h-full gap-4', 'boardPage')}
      >
        <div className="flex justify-between max-sm:px-3">
          <Heading title="Доска задач" />
          {isAdmin && <PrimaryButton>Добавить задачу</PrimaryButton>}
        </div>
        {data && <Board data={data} />}
      </div>
    </LoadingOverlay>
  );
}
