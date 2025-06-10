import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationController],
  imports: [MailModule],
  providers: [PrismaService, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationModule {}
