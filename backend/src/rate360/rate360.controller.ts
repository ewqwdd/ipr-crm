import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Rate360Service } from './rate360.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateRateDto } from './dto/create-rate.dto';

@Controller('rate360')
export class Rate360Controller {
  constructor(private readonly rate360Service: Rate360Service) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async rates() {
    const rates = await this.rate360Service.findAll();
    return rates;
  }

  @Post('/')
  @UseGuards(AdminGuard)
  async createRate(@Body() data: CreateRateDto) {
    return this.rate360Service.createRate(data);
  }
}
