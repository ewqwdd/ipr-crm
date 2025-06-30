import { IsNumber, ValidateNested } from 'class-validator';

class SingleRateIdDto {
  @IsNumber({}, { message: 'rate must be a valid number' })
  rate: number;

  @IsNumber({}, { message: 'indicatorId must be a valid number' })
  indicatorId?: number;
}

export class MultipleRateIdDto {
  @IsNumber({}, { message: 'rateId must be a valid number' })
  rateId?: number;

  @ValidateNested({ each: true })
  rates: SingleRateIdDto[];
}
