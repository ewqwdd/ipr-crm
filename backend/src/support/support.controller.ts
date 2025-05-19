import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { SupportService } from './support.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { GetSupportTicketsDto } from './dto/get-support-tickets.dto';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketStatusDto } from './dto/update-support-ticket-status.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  @UseGuards(AuthGuard)
  getSupportTickets(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.supportService.getUserSupportTickets(sessionInfo.id);
  }

  @Get('/admin')
  @UseGuards(AdminGuard)
  getSupportTicketsAdmin(@Query() params: GetSupportTicketsDto) {
    return this.supportService.getSupportTickets(params);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getSupportTicket(
    @Param('id') ticketId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.supportService.getSupportTicket(ticketId, sessionInfo);
  }

  @Post()
  @UseGuards(AuthGuard)
  createSupportTicket(
    @Body() data: CreateSupportTicketDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.supportService.createSupportTicket(sessionInfo.id, data);
  }

  @Post('/admin/:id/status')
  @UseGuards(AdminGuard)
  updateSupportTicketStatus(
    @Body() data: UpdateSupportTicketStatusDto,
    @Param('id') ticketId: number,
  ) {
    return this.supportService.updateSupportTicket(ticketId, {
      status: data.status,
    });
  }

  @Post('/admin/:id/assign-self')
  @UseGuards(AdminGuard)
  assignSelfToSupportTicket(
    @Param('id') ticketId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.supportService.assignSelfToSupportTicket(
      ticketId,
      sessionInfo.id,
    );
  }
}
