import { SupportTicketStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateSupportTicketStatusDto {
  @IsEnum(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  status: SupportTicketStatus;
}
