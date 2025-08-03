import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  useDraggable,
  type DragStartEvent,
} from "@dnd-kit/core";
import { type Task, type TaskStatus } from "@/shared/types/Ipr";
import TaskBoardCard from "./TaskBoardCard";
import { useAtom } from "jotai";
import { userBoardAtom } from "@/atoms/userBoardAtom";

const columnNames: Record<TaskStatus, string> = {
  TO_DO: "Назначено",
  IN_PROGRESS: "В работе",
  IN_REVIEW: "На проверке",
  COMPLETED: "Готово",
};

const DroppableColumn = ({
  id,
  children,
  count,
}: {
  id: TaskStatus;
  children?: React.ReactNode;
  count?: number;
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="sm:p-3 px-5 flex flex-col gap-3 sm:gap-1 sm:bg-[#E6E6E6]/35 rounded-[20px]">
      <p className="sm:text-sm text-accent sm:text-secondary">
        {columnNames[id]} <span className="sm:hidden">({count})</span>
      </p>
      <div ref={setNodeRef} className="grid sm:grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  );
};

const Draggable = ({
  id,
  task,
  onChange,
}: {
  id: number;
  task: Task;
  onChange?: (id: number, status: TaskStatus) => void;
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: id,
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <TaskBoardCard onChange={onChange} isDragging={isDragging} task={task} />
    </div>
  );
};

interface TrelloBoardProps {
  tasks: Task[];
  onChange?: (id: number, status: TaskStatus) => void;
}

export default function TrelloBoard({ tasks, onChange }: TrelloBoardProps) {
  const [columns, setColumns] = useAtom(userBoardAtom);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useEffect(() => {
    setColumns({
      TO_DO: tasks.filter((task) => task.status === "TO_DO"),
      IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
      IN_REVIEW: tasks.filter((task) => task.status === "IN_REVIEW"),
      COMPLETED: tasks.filter((task) => task.status === "COMPLETED"),
    });
    return () => {
      setColumns(null);
    };
  }, [tasks, setColumns]);

  if (!columns) return null;

  const handleDragStart = (e: DragStartEvent) => {
    const activeTask = Object.values(columns)
      .flat()
      .find((task) => task.id === e.active.id);
    setActiveTask(activeTask || null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const sourceColumn = Object.entries(columns).find(([, tasks]) =>
      tasks.find((task) => task.id === active.id),
    )?.[0] as TaskStatus;

    if (!sourceColumn || sourceColumn === over.id) return;

    const draggedTask = columns[sourceColumn].find(
      (task) => task.id === active.id,
    );
    if (!draggedTask) return;

    onChange?.(draggedTask.id, over.id as TaskStatus);
    setColumns((prev) => {
      const newColumns = { ...prev! };

      newColumns[sourceColumn] = prev![sourceColumn].filter(
        (task) => task.id !== active.id,
      );

      if (over.id in newColumns) {
        newColumns[over.id as TaskStatus] = [
          ...prev![over.id as TaskStatus],
          { ...draggedTask, status: over.id as TaskStatus },
        ];
      }

      return newColumns;
    });
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col gap-5 sm:gap-3 font-extrabold">
        {Object.entries(columns).map(([columnId, tasks]) => (
          <DroppableColumn
            count={tasks.length}
            key={columnId}
            id={columnId as TaskStatus}
          >
            {tasks.map((task) => (
              <Draggable
                onChange={onChange}
                key={task.id}
                id={task.id}
                task={task}
              />
            ))}
            {tasks.length === 0 && (
              <div className="rounded-3xl border-foreground-1 border-2 border-dashed text-sm min-h-40 flex items-center col-span-2 text-secondary text-center justify-center">
                Нет задач
              </div>
            )}
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskBoardCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
