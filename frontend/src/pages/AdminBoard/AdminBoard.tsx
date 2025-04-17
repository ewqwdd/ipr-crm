import { useAppDispatch, useAppSelector } from '@/app';
import { useLoading } from '@/app/hooks/useLoading';
import { Board } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function AdminBoard() {
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading } = iprApi.useFindBoardForUserQuery(Number(userId));
  const dispatch = useAppDispatch();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    return () => {
      if (data) {
        dispatch(
          iprApi.util.invalidateTags([
            'ipr',
            { type: 'board', id: Number(userId) },
          ]),
        );
      }
    };
  }, [dispatch, data, userId]);

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  const plan = useAppSelector((state) => state.board.plan);

  return (
    <div className={cva('px-8 py-10 flex flex-col h-full gap-4', 'boardPage')}>
      <div className="flex justify-between">
        <Heading title="Доска задач" description={plan?.user.username} />
      </div>
      {data && <Board userId={Number(userId)} data={data} />}
    </div>
  );
}
