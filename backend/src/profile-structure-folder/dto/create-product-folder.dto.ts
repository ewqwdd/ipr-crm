import { IsString } from 'class-validator';

export class CreateProductFolderDto {
  @IsString()
  name: string;
}
