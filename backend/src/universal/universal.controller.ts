import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UniversalService } from './universal.service';

@Controller('universal')
export class UniversalController {
  constructor(private readonly universalService: UniversalService) {}

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async roles() {
    const roles = await this.universalService.findRoles();
    return roles;
  }
}
