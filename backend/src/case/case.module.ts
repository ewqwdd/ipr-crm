import { Module } from '@nestjs/common';
import { CaseController } from './case.controller';
import { CaseService } from './case.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { AssesmentService } from 'src/shared/assesment/assesment.service';

@Module({
  controllers: [CaseController],
  imports: [UsersModule],
  providers: [CaseService, PrismaService, AssesmentService],
})
export class CaseModule {}
