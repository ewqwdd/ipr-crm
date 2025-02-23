import { Module } from '@nestjs/common';
import { IprController } from './ipr.controller';
import { PrismaService } from 'src/utils/db/prisma.service';

@Module({
  controllers: [IprController],
  providers: [PrismaService],
})
export class IprModule {}
