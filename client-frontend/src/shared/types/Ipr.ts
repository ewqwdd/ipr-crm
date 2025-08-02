import type { Material } from "../types/Material";
import type { Competency, Indicator, Rate } from "../types/Rate";
import type { User } from "./User";

export const taskStatuses = [
  "TO_DO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
] as const;

export const taskTypes = ["GENERAL", "OBVIOUS", "OTHER"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskType = (typeof taskTypes)[number];
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export const statusNames: Record<TaskStatus, string> = {
  TO_DO: "Назначено",
  IN_PROGRESS: "В работе",
  IN_REVIEW: "На проверке",
  COMPLETED: "Готово",
};

export const priorityNames: Record<TaskPriority, string> = {
  HIGH: "Высокий",
  MEDIUM: "Средний",
  LOW: "Низкий",
};

export interface Task {
  id: number;
  deadline: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  onBoard: boolean;
  planId: number;
  competencyId: number | null;
  indicatorId: number | null;
  materialId: number | null;
  material: Material | null;
  indicator: Indicator | null;
  competency: Competency | null;
}

export interface Ipr {
  id: number;
  userId: number;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "INACTIVE";
  goal: string;
  result: string | null;
  specId: number | null;
  rate360Id: number;
  archived: boolean;
  version: string;
  skillType: "HARD" | "SOFT";
  tasks: Task[];
  user: User;
  rate360: Rate;
  team: { name: string };
  planCurators: {
    user: {
      avatar?: string;
      id: number;
      username: string;
    };
  }[];
}
