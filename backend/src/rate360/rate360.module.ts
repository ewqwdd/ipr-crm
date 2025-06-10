import { Module } from '@nestjs/common';
import { Rate360Controller } from './rate360.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { Rate360Service } from './rate360.service';
import { UsersAccessService } from 'src/users/users-access.service';
import { TeamsHelpersService } from 'src/teams/teams.helpers.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [Rate360Controller],
  imports: [NotificationModule],
  providers: [
    PrismaService,
    Rate360Service,
    UsersAccessService,
    TeamsHelpersService,
  ],
})
export class Rate360Module {}
