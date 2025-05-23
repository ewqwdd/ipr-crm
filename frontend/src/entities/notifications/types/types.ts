export const NotificationTypes = [
  'RATE_ASSIGNED_SELF',
  'RATE_CONFIRM',
  'TASK_ASSIGNED',
  'IPR_ASSIGNED',
  'RATE_ASSIGNED',
  'TEST_ASSIGNED',
  'SURVEY_ASSIGNED',
  'SUPPORT_TICKET_CREATED',
] as const;
export type NotificationType = (typeof NotificationTypes)[number];

export interface Notification {
  date: string;
  description?: string;
  id: number;
  iprId?: number;
  rateId?: number;
  title: string;
  type: NotificationType;
  url?: string;
  userId: number;
  watched: boolean;
}
