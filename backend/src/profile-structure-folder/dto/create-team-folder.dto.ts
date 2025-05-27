import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTeamFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
