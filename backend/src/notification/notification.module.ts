import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { MailService } from 'src/utils/mailer/mailer';
import { NotificationsService } from 'src/utils/notifications/notifications.service';

@Module({
  controllers: [NotificationController],
  providers: [PrismaService, MailService, NotificationsService],
})
export class NotificationModule {}
