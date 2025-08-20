import { IsBoolean } from 'class-validator';

export class ToggleFiredStatusDto {
  @IsBoolean()
  fired: boolean;
}
