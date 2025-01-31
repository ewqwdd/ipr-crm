import { Controller, Get, UseGuards } from '@nestjs/common';
import { Rate360Service } from './rate360.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('rate360')
export class Rate360Controller {
  constructor(private readonly rate360Service: Rate360Service) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async rates() {
    const rates = await this.rate360Service.findAll();
    return rates;
  }
}
