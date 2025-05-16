import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Rate360Service } from './rate360.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateRateDto } from './dto/create-rate.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { RatingsDto } from './dto/user-assesment.dto';
import { ConfirmRateDto } from './dto/confirm-rate.dto';
import { DeleteRatesDto } from './dto/delete-rates.dto';
import { ToggleReportVisibilityDto } from './dto/toggle-report-visibility.dto';
import { SingleRateIdDto } from './dto/single-rate-id.dto';
import { SingleCommentDto } from './dto/single-comment.dto';
import { DeleteEvaluatorsDto } from './dto/delete-evaluators.dto';
import { AddEvaluatorsDto } from './dto/add-evalators.dto';
import { RateFiltersDto } from './dto/rate-filters.dto';

@Controller('rate360')
export class Rate360Controller {
  constructor(private readonly rate360Service: Rate360Service) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async rates(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Query() params: RateFiltersDto,
  ) {
    if (params.subbordinatesOnly) {
      return await this.rate360Service.findAllSubbordinates(
        params,
        sessionInfo.id,
      );
    }
    if (sessionInfo.role === 'admin') {
      return await this.rate360Service.findAll(params);
    } else {
      return await this.rate360Service.findAll(params, sessionInfo.id);
    }
  }

  @Post('/')
  @UseGuards(AuthGuard)
  async createRate(
    @Body() data: CreateRateDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.rate360Service.createRate(data, sessionInfo);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteRate(@Param('id', { transform: (v) => parseInt(v) }) id: number) {
    return this.rate360Service.deleteRate(id);
  }

  @Post('/report-visibility')
  @UseGuards(AuthGuard)
  async toggleReportVisibility(
    @Body() data: ToggleReportVisibilityDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.rate360Service.toggleReportVisibility(data, sessionInfo);
  }

  @Get('/assigned-rates')
  @UseGuards(AuthGuard)
  async assignedRates(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    const id = sessionInfo.id;
    return await this.rate360Service.findAssignedRates(id);
  }

  @Get('/self-rates')
  @UseGuards(AuthGuard)
  async selfRates(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    const id = sessionInfo.id;
    return await this.rate360Service.findSelfRates(id);
  }

  @Get('/rate/:id')
  @UseGuards(AuthGuard)
  async rate(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.findForUser(sessionInfo.id, id);
  }

  @Post('/assesment')
  @UseGuards(AuthGuard)
  async assesment(
    @Body() data: RatingsDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.userAssessment(sessionInfo.id, data);
  }

  @Post('/assesment/indicator')
  @UseGuards(AuthGuard)
  async assesmentIndicator(
    @Body() data: SingleRateIdDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.singleAssessment(sessionInfo.id, data);
  }

  @Post('/assesment/comment')
  @UseGuards(AuthGuard)
  async assesmentComment(
    @Body() data: SingleCommentDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.singleComment(sessionInfo.id, data);
  }

  @Post('/assesment/approve-self/:rateId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async approveSelf(
    @Param('rateId', { transform: (v) => parseInt(v) }) rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.approveSelfRate(sessionInfo.id, rateId);
  }

  @Post('/assesment/approve-assigned/:rateId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async approveAssigned(
    @Param('rateId', { transform: (v) => parseInt(v) }) rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.approveAssignedRate(
      sessionInfo.id,
      rateId,
    );
  }

  @Post('/assesment/leave-assigned/:rateId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async leaveAssigned(
    @Param('rateId', { transform: (v) => parseInt(v) }) rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.leaveAssignedRate(sessionInfo.id, rateId);
  }

  @Post('/approve-curator/:rateId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async confirmCurator(
    @Param('rateId', { transform: (v) => parseInt(v) }) rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.confirmRateCurator(sessionInfo.id, rateId);
  }

  @Post('/approve-user/:rateId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async confirmUser(
    @Param('rateId', { transform: (v) => parseInt(v) }) rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.confirmRateUser(sessionInfo.id, rateId);
  }

  @Get('/confirm-by-curator')
  @UseGuards(AuthGuard)
  async findCuratorConfirm(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return await this.rate360Service.findRatesToConfirmByCurator(
      sessionInfo.id,
    );
  }

  @Post('/confirm-by-curator')
  @UseGuards(AuthGuard)
  async curatorConfirm(
    @Body() data: ConfirmRateDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.confirmByCurator(data, sessionInfo.id);
  }

  @Get('/confirm-by-user')
  @UseGuards(AuthGuard)
  async findUserConfirm(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return await this.rate360Service.findRatesToConfirmByUser(sessionInfo.id);
  }

  @Post('/confirm-by-user')
  @UseGuards(AuthGuard)
  async userConfirm(
    @Body() data: ConfirmRateDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return await this.rate360Service.confirmByUser(data, sessionInfo.id);
  }

  @Post('/delete-rates')
  @UseGuards(AdminGuard)
  async deleteRates(@Body() data: DeleteRatesDto) {
    return await this.rate360Service.deleteRates(data.ids);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMyRates(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Query() params: RateFiltersDto,
  ) {
    return await this.rate360Service.findMyRates(sessionInfo.id, params);
  }

  @Get('/:id/report')
  @UseGuards(AuthGuard)
  async getReport(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    const rate = await this.rate360Service.report(id, sessionInfo);

    if (!rate) throw new NotFoundException('Отчет недоступен');
    return rate;
  }

  @Post('/notify')
  @UseGuards(AuthGuard)
  async notify(@Body() data: DeleteRatesDto) {
    return await this.rate360Service.notifyRates(data.ids);
  }

  @Delete('/:id/evaluator')
  @UseGuards(AdminGuard)
  async deleteEvaluators(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: DeleteEvaluatorsDto,
  ) {
    return await this.rate360Service.deleteEvaluators(id, data);
  }

  @Post('/:id/evaluator')
  @UseGuards(AdminGuard)
  async setEvaluators(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: AddEvaluatorsDto,
  ) {
    return await this.rate360Service.setEvaluators(id, data);
  }

  @Post('/archive-rates')
  @UseGuards(AuthGuard)
  async archiveRate(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Body() data: DeleteRatesDto,
  ) {
    return await this.rate360Service.archiveRate(data.ids, sessionInfo);
  }
}
