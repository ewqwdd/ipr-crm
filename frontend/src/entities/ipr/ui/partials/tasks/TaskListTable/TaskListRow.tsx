import { Task } from '@/entities/ipr/model/types';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Overlay } from '@/shared/ui/Overlay';
import { MapIcon } from '@heroicons/react/outline';
import { FC, memo } from 'react';
import TaskItem from '../TaskItem';

type TaskListRowProps = {
  disableSelect: boolean;
  checked: boolean;
  onChange: (id: Task['id']) => void;
  userId?: number;
};

const TaskListRow: FC<Task & TaskListRowProps> = ({
  id,
  disableSelect,
  material,
  onBoard,
  priority,
  deadline,
  status,
  checked,
  onChange,
  userId,
}) => {
  return (
    <tr>
      <td className="w-[40%] py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}`}
            disabled={disableSelect}
            checked={checked}
            onChange={() => onChange(id)}
            title={material?.name}
          />
          {onBoard && (
            <Overlay overlay="Добавлен на доску">
              <MapIcon className="size-5 text-indigo-500" />
            </Overlay>
          )}
        </div>
      </td>
      <td className="w-[18%] px-3 py-4 ">
        <TaskItem.MaterialType
          contentType={material?.contentType}
          url={material?.url}
        />
      </td>
      <td className="w-[12%] px-3 py-4 text-sm text-gray-500">
        <TaskItem.Priority id={id} priority={priority} userId={userId} />
      </td>
      <td className="w-[18%] px-3 py-4 text-sm text-gray-500">
        <TaskItem.Deadline deadline={deadline} status={status} id={id} />
      </td>
      <td className="w-[12%] px-3 py-4 text-sm text-gray-500">
        <TaskItem.Status id={id} status={status} userId={userId} />
      </td>
    </tr>
  );
};

export default memo(TaskListRow);
