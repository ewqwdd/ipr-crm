import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDTO } from './dto/create-test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createTest(@Body() data: CreateTestDTO) {
    return this.testService.createTest(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTests(
    @Query('name') name: string,
    @Query('startDate', { transform: (d) => d ? new Date(d) : undefined }) startDate: Date,
    @Query('endDate', { transform: (d) => d ? new Date(d) : undefined }) endDate: Date,
  ) {
    return this.testService.getTests(name, startDate, endDate);
  }
}
