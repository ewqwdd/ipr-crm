import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { TestService } from './test.service';
import { ExcelService } from 'src/utils/excel/excel.service';
import { UsersAccessService } from 'src/users/users-access.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [TestController],
  imports: [NotificationModule],
  providers: [PrismaService, TestService, ExcelService, UsersAccessService],
})
export class TestModule {}
