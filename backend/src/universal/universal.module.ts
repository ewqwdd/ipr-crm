import { Module } from '@nestjs/common';
import { UniversalController } from './universal.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UniversalService } from './universal.service';

@Module({
  controllers: [UniversalController],
  providers: [PrismaService, UniversalService],
})
export class UniversalModule {}
