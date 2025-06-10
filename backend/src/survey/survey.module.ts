import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ExcelService } from 'src/utils/excel/excel.service';
import { ValidationsService } from 'src/utils/validations/validations.service';
import { UsersAccessService } from 'src/users/users-access.service';
import { FilesService } from 'src/utils/files/files.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [SurveyController],
  imports: [NotificationModule],
  providers: [
    SurveyService,
    PrismaService,
    ExcelService,
    FilesService,
    ValidationsService,
    UsersAccessService,
  ],
})
export class SurveyModule {}
