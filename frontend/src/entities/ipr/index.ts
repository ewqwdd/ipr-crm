import IprEdit from './ui/IprEdit';
import Board from './ui/Board/Board';
import { boardReducer, boardActions } from './model/boardSlice';
import IprTable from './ui/IprTable/IprTable';
import DeleteTaskModal from './ui/DeleteTaskModal/DeleteTaskModal';
import TaskPreviewModal from './ui/TaskPreviewModal/TaskPreviewModal';
import IprHeadingCurator from './ui/partials/IprHeadingCurator';
import { taskStatuses, taskTypes } from './model/types';
import UserIprTasks from './ui/partials/user-tasks/UserIprTasks';
import IprProgress from './ui/partials/IprProgress';

export type {
  Ipr,
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
  CustomCard,
} from './model/types';

export {
  IprEdit,
  boardReducer,
  boardActions,
  Board,
  IprTable,
  DeleteTaskModal,
  TaskPreviewModal,
  IprHeadingCurator,
  taskStatuses,
  UserIprTasks,
  taskTypes,
  IprProgress,
};
