import IprEdit from './ui/IprEdit';
import Board from './ui/Board/Board';
import { boardReducer, boardActions } from './model/boardSlice';

export type {
  Ipr,
  Task,
  TaskPriority,
  TaskStatus,
  TaskType,
  CustomCard,
} from './model/types';

export { IprEdit, boardReducer, boardActions, Board };
