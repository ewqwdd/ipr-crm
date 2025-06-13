import { Module } from '@nestjs/common';
import { Rate360Controller } from './rate360.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { Rate360Service } from './rate360.service';
import { TeamsHelpersService } from 'src/teams/teams.helpers.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [Rate360Controller],
  imports: [NotificationModule, UsersModule],
  providers: [PrismaService, Rate360Service, TeamsHelpersService],
})
export class Rate360Module {}
