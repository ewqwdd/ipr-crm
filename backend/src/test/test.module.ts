import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { TestService } from './test.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
import { ExportModule } from 'src/export/export.module';

@Module({
  controllers: [TestController],
  imports: [NotificationModule, UsersModule, ExportModule],
  providers: [PrismaService, TestService],
})
export class TestModule {}
