import { IsString } from 'class-validator';

export class InviteAcceptDTO {
  @IsString()
  code: string;
  @IsString()
  password: string;
}
