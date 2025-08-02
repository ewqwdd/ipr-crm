import { openModalAtom } from "@/atoms/modalAtom";
import { userBoardAtom } from "@/atoms/userBoardAtom";
import PriorityBadge from "@/features/PriorityBadge";
import { cva } from "@/shared/lib/cva";
import { dateService } from "@/shared/lib/services/dateService";
import type { Task, TaskStatus } from "@/shared/types/Ipr";
import { materialTypes } from "@/shared/types/Material";
import Badge from "@/shared/ui/Badge";
import ShadowCard from "@/shared/ui/ShadowCard";
import { useSetAtom } from "jotai";
import type { MouseEvent } from "react";

interface IprTaskListItemProps {
  task: Task;
  isDragging?: boolean;
  onChange?: (id: number, status: TaskStatus) => void;
}

export default function TaskBoardCard({
  task,
  isDragging,
  onChange,
}: IprTaskListItemProps) {
  const openModal = useSetAtom(openModalAtom);
  const setBoard = useSetAtom(userBoardAtom);

  const handleStatusChange = (status: TaskStatus) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const found = Object.values(prev)
        .find((tasks) => tasks.find((t) => t.id === task.id))
        ?.find((t) => t.id === task.id);
      if (!found || found.status === status) return prev;
      return {
        ...prev,
        [found.status]: prev[found.status].filter((t) => t.id !== task.id),
        [status]: [...prev[status], { ...task, status }],
      };
    });
    onChange?.(task.id, status);
  };

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    openModal({
      type: "TASK",
      data: { task, onChangeStatus: handleStatusChange },
    });
  };

  return (
    <ShadowCard
      onClick={onClick}
      className={cva("transition-all cursor-grab flex flex-col", {
        "scale-95 opacity-40": !!isDragging,
      })}
    >
      <div className="flex justify-between">
        <span className="text-secondary text-sm">
          {task.deadline
            ? dateService.formatDate(task.deadline)
            : "Без дедлайна"}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="line-clamp-6 mt-1">{task.material?.name}</p>
      {task.material?.contentType && (
        <Badge className="mt-3 self-start" variant="primary-light">
          {materialTypes[task.material?.contentType]}
        </Badge>
      )}
    </ShadowCard>
  );
}
