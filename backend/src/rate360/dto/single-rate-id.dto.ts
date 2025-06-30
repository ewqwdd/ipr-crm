import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SingleRateIdDto {
  @IsNumber({}, { message: 'rate must be a valid number' })
  rate: number;

  rateId?: number;
}
