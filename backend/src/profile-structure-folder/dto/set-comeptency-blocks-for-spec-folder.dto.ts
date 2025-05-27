import { IsNotEmpty } from 'class-validator';

export class SetCompetencyBlocksForSpecFolderDto {
  @IsNotEmpty()
  competencyBlockIds: number[];
}
