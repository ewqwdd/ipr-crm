import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CaseService } from './case.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateCaseRateDto } from './dto/create-case-rate.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AnswerCaseRateDto } from './dto/answer-case-rate.dto';
import { DeleteCaseDto } from './dto/delete-case.dto';
import { SetEvaluatorsDto } from './dto/ser-evaluators.dto';
import { AssesmentService } from 'src/shared/assesment/assesment.service';

@Controller('case')
export class CaseController {
  constructor(
    private caseService: CaseService,
    private assesmentService: AssesmentService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  getCases() {
    return this.caseService.getCases();
  }

  @Post()
  @UseGuards(AdminGuard)
  createCase(@Body() data: CreateCaseDto) {
    return this.caseService.createCase(data);
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  updateCase(@Param('id') id: number, @Body() data: CreateCaseDto) {
    return this.caseService.editCase(Number(id), data);
  }

  @Delete('/')
  @UseGuards(AdminGuard)
  deleteCase(@Body() data: DeleteCaseDto) {
    return this.caseService.deleteMultipleCases(data.ids);
  }

  @Get('/rates')
  @UseGuards(AuthGuard)
  getCaseRates(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.caseService.getCaseRates(sessionInfo);
  }

  @Get('/my-rates')
  @UseGuards(AuthGuard)
  getMyCaseRates(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.caseService.getMyCaseRates(sessionInfo);
  }

  @Post('/rates')
  @UseGuards(AdminGuard)
  createCaseRate(
    @Body() data: CreateCaseRateDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.caseService.createCaseRate(data, sessionInfo);
  }

  @Get('/rates/assigned')
  @UseGuards(AuthGuard)
  getAssignedCaseRates(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.caseService.getAssignedCases(sessionInfo);
  }

  @Get('/rates/assigned/:id')
  @UseGuards(AuthGuard)
  getAssignedCaseRate(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.assesmentService.findForUser(sessionInfo.id, id);
  }

  @Post('/rates/assigned/:id/answer')
  @UseGuards(AuthGuard)
  answerCaseRate(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: AnswerCaseRateDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.caseService.answerCaseRate(id, data, sessionInfo);
  }

  @Get('/rates/report/:id')
  @UseGuards(AuthGuard)
  getCaseResult(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.caseService.getCaseResult(id, sessionInfo);
  }

  @Post('/rates/evaluators')
  @UseGuards(AdminGuard)
  getEvaluators(@Body() data: SetEvaluatorsDto) {
    return this.caseService.setEvaluators(data);
  }
}
