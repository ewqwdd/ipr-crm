import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSpecFolderDto {
  @IsArray()
  @IsString({ each: true })
  specs: string[];

  @IsNumber()
  @IsNotEmpty()
  teamId: number;
}
