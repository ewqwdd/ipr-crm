import type { Ipr, TaskType } from "@/shared/types/Ipr";
import { useMemo } from "react";
import IprTaskListItem from "./IprTaskListItem";
import Divider from "@/shared/ui/Divider";

interface IprTaskListProps {
  ipr: Ipr;
  type: TaskType;
  label: string;
}

interface TaskList {
  label: string;
  tasks: Ipr["tasks"];
}

export default function IprTaskList({ ipr, type, label }: IprTaskListProps) {
  const tasksList = useMemo(() => {
    const allTasks = ipr.tasks.filter((task) => task.type === type);
    if (type === "OBVIOUS" || type === "OTHER") {
      const titles = Array.from(
        new Set(allTasks.map((task) => task.indicator?.name)),
      ).filter(Boolean);
      const group: TaskList[] = [];
      titles.forEach((title) => {
        group.push({
          label: title!,
          tasks: allTasks.filter((task) => task.indicator?.name === title),
        });
      });
      const empty = allTasks.filter((task) => !task.indicator?.name);
      if (empty.length) {
        group.push({
          label: "Без индикатора",
          tasks: empty,
        });
      }
      return group;
    } else if (type === "GENERAL") {
      const titles = Array.from(
        new Set(allTasks.map((task) => task.competency?.name)),
      ).filter(Boolean);
      const group: TaskList[] = [];
      titles.forEach((title) => {
        group.push({
          label: title!,
          tasks: allTasks.filter((task) => task.competency?.name === title),
        });
      });
      const empty = allTasks.filter((task) => !task.competency?.name);
      if (empty.length) {
        group.push({
          label: "Без компетенции",
          tasks: empty,
        });
      }
    }
  }, [ipr, type]);

  const hasTasks = tasksList?.some((task) => task.tasks.length > 0);

  if (!hasTasks) {
    return null;
  }

  return (
    <>
      <Divider />
      <h2 className="text-accent">{label}</h2>
      {tasksList?.map((taskListItem) => (
        <div key={taskListItem.label}>
          <h3 className="mt-2">{taskListItem.label}</h3>
          <div className="grid lg:grid-cols-2 gap-3 mt-5">
            {taskListItem.tasks.map((task) => (
              <IprTaskListItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
