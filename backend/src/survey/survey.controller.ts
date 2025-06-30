import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { SurveyService } from './survey.service';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { CreateSurveyDTO } from './dto/create-survey.dto';
import { AssignUsersDTO } from './dto/assign-users.dto';
import { ToggleHiddenDTO } from './dto/toggle-hidden.dto';
import { AnswerQuestionDTO } from './dto/answer-question.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationsService } from 'src/utils/validations/validations.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('survey')
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly validationsService: ValidationsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getAdminSurveys(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.surveyService.getAdminSurveys(sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createSurvey(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Body() data: CreateSurveyDTO,
  ) {
    return this.surveyService.createSurvey(data, sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id')
  async assignUsers(
    @Param('id') id: string,
    @Body() data: AssignUsersDTO,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.assignUsersToSurvey(
      Number(id),
      data,
      sessionInfo,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/assigned/:id')
  @HttpCode(HttpStatus.OK)
  async getAssignedTestById(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.getAssignedSurvey(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Post('/assigned/:id/start')
  @HttpCode(HttpStatus.OK)
  async startTest(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.startAssesment(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/:id/hidden')
  async hideSurvey(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Body() body: ToggleHiddenDTO,
  ) {
    return this.surveyService.toggleSurveyHidden(
      Number(id),
      body.hidden,
      sessionInfo,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteSurvey(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.deleteSurvey(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/:surveyId/notify')
  async notifySurvey(
    @Param('surveyId') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.notifySurveyAssigned(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Put('/admin/:id')
  @HttpCode(HttpStatus.OK)
  async updateSurvey(
    @Param('id') id: string,
    @Body() data: CreateSurveyDTO,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.editSurvey(Number(id), data, sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Get('/admin/:id')
  @HttpCode(HttpStatus.OK)
  async getSurveyByIdAdmin(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.getSurveyAdmin(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @Get('/assigned')
  @HttpCode(HttpStatus.OK)
  async getTestsAssigned(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.surveyService.getAssignedSurveys(sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id/answer')
  @UseInterceptors(FileInterceptor('fileAnswer'))
  async answerQuestion(
    @Param('id') id: string,
    @Body() rawBody: any,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const normalized = this.validationsService.normalizeFormDataArray(rawBody, [
      'optionAnswer',
    ]);

    const dto = plainToInstance(AnswerQuestionDTO, normalized, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.surveyService.answerQuestion(
      Number(id),
      sessionInfo,
      dto,
      file,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/assigned/:id/finish')
  async finishTest(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.finishSurvey(Number(id), sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/finished/:id')
  async getFinishedTestById(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.getUserFinishedSurveyById(
      Number(id),
      sessionInfo,
    );
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/finished')
  async getFinishedTests(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.surveyService.getFinishedSurveys(sessionInfo);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id/result')
  async getSurveyResults(
    @Param('id') id: string,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.surveyService.getResultSurvey(Number(id), sessionInfo);
  }
}
