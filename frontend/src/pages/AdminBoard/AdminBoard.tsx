import { useAppDispatch, useAppSelector } from '@/app';
import { Board } from '@/entities/ipr';
import { iprApi } from '@/shared/api/iprApi';
import { cva } from '@/shared/lib/cva';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function AdminBoard() {
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading } = iprApi.useFindBoardForUserQuery(Number(userId));
  const dispatch = useAppDispatch();

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

  // TODO: replace loading

  const plan = useAppSelector((state) => state.board.plan);

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div
        className={cva(
          'sm:px-8 py-6 sm:py-10 flex flex-col h-full gap-4',
          'boardPage',
        )}
      >
        <div className="flex justify-between max-sm:px-4 max-sm:pr-14">
          <Heading title="Доска задач" description={plan?.user.username} />
          {/* <PrimaryButton>Добавить задачу</PrimaryButton> */}
        </div>
        {data && <Board userId={Number(userId)} data={data} />}
      </div>
    </LoadingOverlay>
  );
}
