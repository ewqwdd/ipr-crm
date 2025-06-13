import { Module } from '@nestjs/common';
import { IprController } from './ipr.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { IprService } from './ipr.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [IprController],
  imports: [NotificationModule, UsersModule],
  providers: [PrismaService, IprService],
})
export class IprModule {}
