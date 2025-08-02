import type { Ipr } from "@/shared/types/Ipr";

export const iprService = {
  getPlanProgress: (ipr: Ipr) => {
    const boardTasks = ipr.tasks.filter((task) => !!task.onBoard);
    const completedTasks = boardTasks.filter(
      (task) => task.status === "COMPLETED",
    );

    return Math.round((completedTasks.length / boardTasks.length) * 100);
  },
};
