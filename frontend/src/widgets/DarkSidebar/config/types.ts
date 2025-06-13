import { NotificationType } from '@/entities/notifications';
import { ReactNode } from 'react';

export type NavType = {
  name: string;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  href?: string;
  count?: ReactNode;
  children?: NavType[];
};

export const types360: NotificationType[] = [
  'RATE_ASSIGNED_SELF',
  'RATE_ASSIGNED',
  'RATE_CONFIRM',
];
export const typesTasks: NotificationType[] = ['IPR_ASSIGNED', 'TASK_ASSIGNED'];
