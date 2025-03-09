import { useAppSelector } from '@/app';
import { useLoading } from '@/app/hooks/useLoading';
import { Board } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect } from 'react';

export default function BoardPage() {
  const { data, isLoading } = iprApi.useFindBoardQuery();
  const role = useAppSelector((state) => state.user.user?.role);
  const isAdmin = role?.name === 'admin';

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  return (
    <div className={cva('px-8 py-10 flex flex-col h-full gap-4', 'boardPage')}>
      <div className="flex justify-between">
        <Heading title="Доска задач" />
        {isAdmin && <PrimaryButton>Добавить задачу</PrimaryButton>}
      </div>
      {data && <Board data={data} />}
    </div>
  );
}
