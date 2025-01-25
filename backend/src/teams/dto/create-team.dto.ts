import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => value ? Number(value) : undefined)
  parentTeamId?: number;

  curatorId?: number;
  subTeams?: number[];
}
