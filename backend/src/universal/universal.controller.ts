import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { UniversalService } from './universal.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';

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

  @Get('specs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async specs() {
    const specs = await this.universalService.findSpecs();
    return specs;
  }

  @Post('specs')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  async createSpec(@Body('name') name: string) {
    const spec = await this.universalService.createSpec(name);
    return spec;
  }
}
