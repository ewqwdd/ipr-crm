import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IprService } from './ipr.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('ipr')
export class IprController {
  constructor(private readonly iprService: IprService) {}

  @Get('/360/:id')
  @UseGuards(AuthGuard)
  async findOneby360Id(id: number) {
    return this.iprService.findOneby360Id(id);
  }

  @Post('/360/:rateId')
  @UseGuards(AuthGuard)
  async create(rateId: number) {
    return this.iprService.create(rateId);
  }
}
