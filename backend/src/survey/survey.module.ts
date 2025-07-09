import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ValidationsService } from 'src/utils/validations/validations.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
import { ExportModule } from 'src/export/export.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [SurveyController],
  imports: [NotificationModule, UsersModule, ExportModule, FilesModule],
  providers: [SurveyService, PrismaService, ValidationsService],
})
export class SurveyModule {}
