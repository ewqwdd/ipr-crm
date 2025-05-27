import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpecFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  teamId: number;
}
