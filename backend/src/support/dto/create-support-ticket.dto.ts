import { IsString } from 'class-validator';

export class CreateSupportTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
