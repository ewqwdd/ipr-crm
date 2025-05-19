import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';

@Module({
  controllers: [SupportController],
  providers: [SupportService, PrismaService, NotificationsService, MailService],
})
export class SupportModule {}
