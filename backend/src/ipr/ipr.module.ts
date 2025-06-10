import { Module } from '@nestjs/common';
import { IprController } from './ipr.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { IprService } from './ipr.service';
import { UsersAccessService } from 'src/users/users-access.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [IprController],
  imports: [NotificationModule],
  providers: [PrismaService, IprService, UsersAccessService],
})
export class IprModule {}
