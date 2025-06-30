import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SingleRateIdDto {
  @IsNumber({}, { message: 'rate must be a valid number' }) // Добавили {} для строгой проверки
  rate: number;

  rateId?: number;
}
