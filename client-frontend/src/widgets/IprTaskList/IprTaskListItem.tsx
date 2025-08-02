import TaskStatusBadge from "@/features/TaskStatusBadge";
import { cva } from "@/shared/lib/cva";
import { dateService } from "@/shared/lib/services/dateService";
import { type Task } from "@/shared/types/Ipr";
import { materialTypes } from "@/shared/types/Material";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";

interface IprTaskListItemProps {
  task: Task;
}

export default function IprTaskListItem({ task }: IprTaskListItemProps) {
  const isDeadllinePassed =
    task.deadline && new Date(task.deadline) < new Date();

  return (
    <ShadowCard className="flex flex-col">
      <div className="flex justify-between">
        <span
          className={cva("text-secondary text-sm", {
            "text-error": !!isDeadllinePassed,
          })}
        >
          {task.deadline
            ? dateService.formatDateTime(task.deadline)
            : "Без дедлайна"}
        </span>
        <TaskStatusBadge taskStatus={task.status} />
      </div>
      <p className="mt-1 line-clamp-2">{task.material?.name}</p>
      {task.material?.contentType && (
        <Badge className="mt-3 self-start" variant="primary-light">
          {materialTypes[task.material?.contentType]}
        </Badge>
      )}
    </ShadowCard>
  );
}
