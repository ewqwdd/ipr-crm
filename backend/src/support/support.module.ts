import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [SupportController],
  imports: [MailModule, NotificationModule],
  providers: [SupportService, PrismaService],
})
export class SupportModule {}
