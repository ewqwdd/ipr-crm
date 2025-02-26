import IprEdit from './ui/IprEdit';
import Board from './ui/Board/Board';
import { boardReducer, boardActions } from './model/boardSlice';
import IprTable from './ui/IprTable/IprTable';
import DeleteTaskModal from './ui/DeleteTaskModal/DeleteTaskModal';

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
};
