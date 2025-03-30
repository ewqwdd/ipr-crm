import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDTO } from './dto/create-test.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AssignUsersDTO } from './dto/assign-users.dto';
import { AnswerQuestionDTO } from './dto/answer-question.dto';

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
    @Query('startDate', { transform: (d) => (d ? new Date(d) : undefined) })
    startDate: Date,
    @Query('endDate', { transform: (d) => (d ? new Date(d) : undefined) })
    endDate: Date,
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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/finished')
  async getFinishedTests(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.testService.getFinishedTests(sessionInfo);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getTestById(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.getTest(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Get('/assigned/:id')
  @HttpCode(HttpStatus.OK)
  async getAssignedTestById(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.getAssignedTest(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Post('/assigned/:id/start')
  @HttpCode(HttpStatus.OK)
  async startTest(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.startAssesment(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id')
  async assignUsers(
    @Param('id') id: string,
    @Body() data: AssignUsersDTO,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.assignUsers(Number(id), data, sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id/finish')
  async finishTest(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.testService.finishTest(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id/answer')
  async answerQuestion(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Body() data: AnswerQuestionDTO,
  ) {
    return this.testService.answerQuestion(Number(id), sessionInfo, data);
  }
}
