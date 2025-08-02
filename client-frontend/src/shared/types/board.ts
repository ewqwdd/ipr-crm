import type { Task, TaskStatus } from "./Ipr";

export type BoardColumns = Record<TaskStatus, Task[]>;
