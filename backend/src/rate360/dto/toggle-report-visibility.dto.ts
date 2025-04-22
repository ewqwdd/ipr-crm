import { IsArray, IsBoolean, IsInt } from 'class-validator';

export class ToggleReportVisibilityDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];

  @IsBoolean()
  isVisible: boolean;
}
