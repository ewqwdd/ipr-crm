import { Ipr, TaskType } from '@/entities/ipr/model/types';
import { Card } from '@/shared/ui/Card';
import UserIprTypeBlock from './UserIprTypeBlock';

interface UserTasksProps {
  type: TaskType;
  ipr: Ipr;
}

export default function UserTasks({ type, ipr }: UserTasksProps) {
  let title;

  switch (type) {
    case 'GENERAL':
      title = 'Общие материалы и задачи для развития';
      break;
    case 'OBVIOUS':
      title = 'Очевидные зоны роста';
      break;
    case 'OTHER':
      title = 'Прочие материалы и задачи для развития';
      break;
  }

  return (
    <Card>
      <h3 className="font-semibold ">{title}</h3>
      <UserIprTypeBlock ipr={ipr} type={type} />
    </Card>
  );
}
