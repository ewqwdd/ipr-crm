import { SupportTicketStatus } from './types';

export const supportTicketStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'] as const;

export const supportTicketNames: Record<SupportTicketStatus, string> = {
  OPEN: 'Открыт',
  IN_PROGRESS: 'В процессе',
  CLOSED: 'Закрыт',
};
