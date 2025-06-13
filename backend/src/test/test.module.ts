import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { TestService } from './test.service';
import { ExcelService } from 'src/utils/excel/excel.service';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TestController],
  imports: [NotificationModule, UsersModule],
  providers: [PrismaService, TestService, ExcelService],
})
export class TestModule {}
