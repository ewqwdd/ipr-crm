import { Module } from '@nestjs/common';
import { IprController } from './ipr.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { IprService } from './ipr.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';

@Module({
  controllers: [IprController],
  providers: [PrismaService, IprService, NotificationsService, MailService],
})
export class IprModule {}
