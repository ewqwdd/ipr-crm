import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDTO } from './dto/create-test.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createTest(@Body() data: CreateTestDTO) {
    return this.testService.createTest(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTests(
    @Query('name') name: string,
    @Query('startDate', { transform: (d) => d ? new Date(d) : undefined }) startDate: Date,
    @Query('endDate', { transform: (d) => d ? new Date(d) : undefined }) endDate: Date,
  ) {
    return this.testService.getTests(name, startDate, endDate);
  }

  @UseGuards(AuthGuard)
  @Get('/assigned')
  @HttpCode(HttpStatus.OK)
  async getTestsAssigned(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    console.log(sessionInfo);
    return this.testService.getAssignedTests(sessionInfo);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getTestById(
    @Query('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.getTest(Number(id), sessionInfo);
  }
}
