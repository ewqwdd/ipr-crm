import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';
import { ExcelService } from 'src/utils/excel/excel.service';

@Module({
  controllers: [SurveyController],
  providers: [
    SurveyService,
    PrismaService,
    NotificationsService,
    MailService,
    ExcelService,
  ],
})
export class SurveyModule {}
