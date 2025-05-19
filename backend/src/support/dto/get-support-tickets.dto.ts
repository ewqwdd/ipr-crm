import { SupportTicketStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetSupportTicketsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

  @IsEnum(['OPEN', 'IN_PROGRESS', 'CLOSED'])
  status: SupportTicketStatus;
}
