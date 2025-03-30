import { IsBoolean } from 'class-validator';

export class ToggleHiddenDTO {
  @IsBoolean()
  hidden: boolean;
}
