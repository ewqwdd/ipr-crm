import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamFolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
