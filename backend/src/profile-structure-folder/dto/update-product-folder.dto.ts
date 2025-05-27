import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
