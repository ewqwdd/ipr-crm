import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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

  @Put('specs/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async editSpec(@Body('name') name: string, @Param('id') id: number) {
    const spec = await this.universalService.editSpec(id, name);
    return spec;
  }

  @Delete('specs/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async deleteSpec(@Param('id') id: number) {
    const spec = await this.universalService.deleteSpec(id);
    return spec;
  }
}
