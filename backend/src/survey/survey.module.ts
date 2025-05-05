import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';
import { ExcelService } from 'src/utils/excel/excel.service';
import { S3Service } from 'src/utils/s3/s3.service';
import { ValidationsService } from 'src/utils/validations/validations.service';
import { UsersAccessService } from 'src/users/users-access.service';

@Module({
  controllers: [SurveyController],
  providers: [
    SurveyService,
    PrismaService,
    NotificationsService,
    MailService,
    ExcelService,
    S3Service,
    ValidationsService,
    UsersAccessService,
  ],
})
export class SurveyModule {}
