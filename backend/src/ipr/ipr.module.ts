import { Module } from '@nestjs/common';
import { IprController } from './ipr.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { IprService } from './ipr.service';

@Module({
  controllers: [IprController],
  providers: [PrismaService, IprService],
})
export class IprModule {}
