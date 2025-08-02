export const NotificationTypes = [
  "RATE_ASSIGNED_SELF",
  "RATE_CONFIRM",
  "TASK_ASSIGNED",
  "IPR_ASSIGNED",
  "RATE_ASSIGNED",
  "TEST_ASSIGNED",
  "SURVEY_ASSIGNED",
  "SUPPORT_TICKET_CREATED",
] as const;
export type NotificationType = (typeof NotificationTypes)[number];

export interface Notification {
  id: number;
  userId: number;
  title: string;
  description?: string;
  date: string;
  watched: boolean;
  type: NotificationType;
  url?: string;
  rateId?: number;
  iprId?: number;
}
