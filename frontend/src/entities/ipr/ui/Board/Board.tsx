import { boardActions, CustomCard, Task, TaskStatus } from '@/entities/ipr';
import {
  ControlledBoard,
  OnDragEndNotification,
  moveCard,
} from '@caldwell619/react-kanban';
import { useEffect } from 'react';
import { $api } from '@/shared/lib/$api';
import toast from 'react-hot-toast';
import BoardCard from './BoardCard';
import { useAppDispatch, useAppSelector } from '@/app';
import { Card } from '@/shared/ui/Card';
import { Progress } from '@/shared/ui/Progress';
import { columnNames, lane_names, typeColors } from '../../model/constants';

const backgrounds: Record<TaskStatus, string> = {
  COMPLETED: 'rgb(187 247 208)',
  IN_PROGRESS: 'rgb(125 211 252)',
  IN_REVIEW: 'rgb(254 240 138)',
TO_DO: 'rgb(209 213 219)',
};

const textColor: Record<TaskStatus, string> = {
  COMPLETED: 'rgb(22 101 52)',
  IN_PROGRESS: 'rgb(12 74 110)',
  IN_REVIEW: 'rgb(113 63 18)',
TO_DO: 'rgb(31 41 55)',
};

interface BoardProps {
  data: Task[];
  userId?: number;
}

export default function Board({ data, userId }: BoardProps) {
  const dispatch = useAppDispatch();
  const controlledBoard = useAppSelector((state) => state.board.board);
  const id = useAppSelector((state) => state.user.user?.id);

  const handleCardMove: OnDragEndNotification<CustomCard> = (
    _card,
    source,
    destination,
  ) => {
    const column = controlledBoard?.columns.find(
      (column) => column.id === destination?.toColumnId,
    );
    dispatch(
      boardActions.setBoardCallback((currentBoard) => {
        return moveCard(currentBoard, source, destination);
      }),
    );
    $api
      .post('/ipr/task/status', {
        id: parseInt(_card.id),
        status: column?.id,
      })
      .catch((e) => {
        console.error(e);
        toast.error('Не удалось переместить задачу');
        dispatch(
          boardActions.setBoardCallback((currentBoard) => {
            return moveCard(
              currentBoard,
              {
                fromPosition: destination?.toPosition,
                fromColumnId: destination?.toColumnId,
              },
              {
                toPosition: source?.fromPosition,
                toColumnId: source?.fromColumnId,
              },
            );
          }),
        );
      });
  };

  useEffect(() => {
    if (data) {
      dispatch(
        boardActions.setBoard({
          columns: lane_names.map((name) => ({
            id: name,
            title: columnNames[name],
            cards: data
              .filter((task) => task.status === name)
              .map((task) => ({
                id: task.id.toString(),
                title: task.material?.name || 'Задача',
                description: task.material?.description || 'Индикатор',
                priority: task.priority,
                materialType: task.material?.contentType ?? 'VIDEO',
                badgeColor: typeColors[task.material?.contentType ?? 'VIDEO'],
                task: task,
              })),
          })),
        }),
      );
    }
  }, [data]);

  const cols = controlledBoard?.columns;

  const percent = cols
    ? (cols[2].cards.length + cols[3].cards.length) /
      cols.reduce((acc, cur) => cur.cards.length + acc, 0)
    : 0;

  return (
    <div className="boardPage flex-1 flex flex-col">
      {data.length > 0 && (
        <Card className="mb-8 [&>div]:py-4 self-start [&>div]:flex [&>div]:gap-8 [&>div]:items-center">
          Прогресс:
          <Progress
            className="min-w-52 [&_figure]:bg-indigo-500"
            percent={percent}
          />
        </Card>
      )}
      {controlledBoard && (
        <ControlledBoard
          allowAddCard={false}
          onCardDragEnd={handleCardMove}
          disableColumnDrag
          allowRenameColumn={false}
          renderColumnHeader={(column) => (
            <div className="ext-sm font-medium flex justify-between items-center pr-2 p-2 rounded-t-lg" style={{
              backgroundColor: backgrounds[column.id as TaskStatus] ?? 'white',
              color: textColor[column.id as TaskStatus] ?? 'black',
            }}>
              <h2 className='text-lg font-semibold'>
                {column.title}:{' '}
                <span className="text-gray-600">
                  {column.cards.length}
                </span>
              </h2>
              {['TO_DO', 'IN_PROGRESS'].includes(column.id.toString()) && (
                <p className='text-xs'>
                  Просрочено:
                  <span className="text-gray-600 font-normal">
                    {' '}
                    {column.cards?.reduce(
                      (acc, cur) =>
                        cur.task.deadline &&
                        new Date(cur.task.deadline).getTime() < Date.now()
                          ? acc + 1
                          : acc,
                      0,
                    )}
                  </span>
                </p>
              )}
            </div>
          )}
          renderCard={(card) => {
            return (
              <BoardCard
                deletable={userId !== id}
                card={card}
                userId={userId}
              />
            );
          }}
        >
          {controlledBoard}
        </ControlledBoard>
      )}
    </div>
  );
}
