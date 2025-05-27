import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSpecFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
