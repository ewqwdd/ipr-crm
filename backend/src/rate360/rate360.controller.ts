import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteRate(@Param('id', { transform: (v) => parseInt(v) }) id: number) {
    return this.rate360Service.deleteRate(id);
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
    console.log(data);
    return await this.rate360Service.confirmByUser(data, sessionInfo.id);
  }
}
