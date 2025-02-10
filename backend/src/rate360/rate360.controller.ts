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
}
