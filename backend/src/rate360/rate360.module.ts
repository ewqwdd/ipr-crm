import { Module } from '@nestjs/common';
import { Rate360Controller } from './rate360.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { Rate360Service } from './rate360.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { MailService } from 'src/utils/mailer/mailer';
import { UsersAccessService } from 'src/users/users-access.service';
import { TeamsHelpersService } from 'src/teams/teams.helpers.service';

@Module({
  controllers: [Rate360Controller],
  providers: [
    PrismaService,
    Rate360Service,
    NotificationsService,
    MailService,
    UsersAccessService,
    TeamsHelpersService,
  ],
})
export class Rate360Module {}
