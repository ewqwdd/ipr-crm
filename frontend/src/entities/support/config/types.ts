import { User } from '@/entities/user';
import { supportTicketStatuses } from './constants';

export type SupportTicketStatus = (typeof supportTicketStatuses)[number];

export interface SupportTicketType {
  id: number;
  title: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  userId: number;
  user: User;
  curator: User | null;
}

export interface CreateSupportTicketDto {
  title: string;
  description: string;
}
