import { Module } from '@nestjs/common';
import { Rate360Controller } from './rate360.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { Rate360Service } from './rate360.service';
import { TeamsHelpersService } from 'src/teams/teams.helpers.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
import { ExportModule } from 'src/export/export.module';
import { AssesmentService } from 'src/shared/assesment/assesment.service';

@Module({
  controllers: [Rate360Controller],
  imports: [NotificationModule, UsersModule, ExportModule],
  providers: [
    PrismaService,
    Rate360Service,
    TeamsHelpersService,
    AssesmentService,
  ],
})
export class Rate360Module {}
