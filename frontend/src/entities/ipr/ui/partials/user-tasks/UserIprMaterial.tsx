import { Task } from '@/entities/ipr/model/types';
import { $api } from '@/shared/lib/$api';
import { Overlay } from '@/shared/ui/Overlay';
import { MapIcon } from '@heroicons/react/outline';
import TaskItem from '../tasks/TaskItem';
import { SelectLight } from '@/shared/ui/SelectLight';
import { taskStatusOptions } from '../tasks/constants';
import { cva } from '@/shared/lib/cva';
import { iprApi } from '@/shared/api/iprApi';
import { useAppDispatch } from '@/app';
import { dateService } from '@/shared/lib/dateService';

interface UserIprTaskProps {
  task: Task;
  iprId: number;
}

export default function UserIprMaterial({ task, iprId }: UserIprTaskProps) {
  const dispatch = useAppDispatch();

  const setStatus = (status: Task['status']) => {
    dispatch(
      iprApi.util.updateQueryData('findUserIprById', iprId, (draft) => {
        const taskIndex = draft.tasks.findIndex((t) => t.id === task.id);
        if (taskIndex !== -1) {
          draft.tasks[taskIndex].status = status;
        }
      }),
    );
    dispatch(iprApi.util.invalidateTags(['user-ipr']));
  };

  const changeStatus = (status: Task['status']) => {
    setStatus(status);
    const prev = task.status;
    $api
      .post('/ipr/task/status', {
        id: task.id,
        status,
      })
      .catch((err) => {
        console.log(err);
        setStatus(prev);
      });
  };

  return (
    <tr>
      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-[400px]">
        <div className="flex items-center gap-2">
          {task.material?.name}
          {task.onBoard && (
            <Overlay overlay="Добавлен на доску">
              <MapIcon className="size-5 text-indigo-500" />
            </Overlay>
          )}
        </div>
      </td>
      <td className="py-4 px-3 text-sm font-medium text-gray-900">
        <TaskItem.MaterialType
          contentType={task.material?.contentType}
          url={task.material?.url}
        />
      </td>

      <td className="py-4 px-3 text-sm font-medium text-gray-900 text-nowrap">
        {task.deadline && (
          <span
            className={cva({
              'text-red-500': new Date(task.deadline) < new Date(),
            })}
          >
            {dateService.formatDateTime(task.deadline)}
          </span>
        )}
      </td>

      <td className="py-4 px-3 text-sm font-medium text-gray-900 w-44">
        <SelectLight
          value={task.status}
          onChange={(e) => changeStatus(e.target.value as Task['status'])}
        >
          {taskStatusOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectLight>
      </td>
    </tr>
  );
}
