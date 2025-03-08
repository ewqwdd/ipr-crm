import { PrioritySelector } from './PrioritySelector';
import Deadline from './Deadline';
import StatusSelector from './StatusSelector';
import MaterialType from './MaterialType';

const TaskItem = {
  MaterialType,
  Priority: PrioritySelector,
  Status: StatusSelector,
  Deadline,
};

export default TaskItem;
