import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationsService) {}

  @Post('/read')
  @UseGuards(AuthGuard)
  async readNotification(
    @Body() data: ReadNotificationsDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.notificationService.readNotifications(data.ids, sessionInfo.id);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getNotifications(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.notificationService.getNotifications(sessionInfo.id);
  }
}
