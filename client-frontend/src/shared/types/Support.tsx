import type { User } from "./User";

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

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
