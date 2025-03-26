import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { TestService } from './test.service';
import { MailService } from 'src/utils/mailer/mailer';

@Module({
  controllers: [TestController],
  providers: [PrismaService, NotificationsService, MailService, TestService],
})
export class TestModule {}
