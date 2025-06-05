import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';
import { ExcelService } from 'src/utils/excel/excel.service';
import { ValidationsService } from 'src/utils/validations/validations.service';
import { UsersAccessService } from 'src/users/users-access.service';
import { FilesService } from 'src/utils/files/files.service';

@Module({
  controllers: [SurveyController],
  providers: [
    SurveyService,
    PrismaService,
    NotificationsService,
    MailService,
    ExcelService,
    FilesService,
    ValidationsService,
    UsersAccessService,
  ],
})
export class SurveyModule {}
