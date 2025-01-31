import { Module } from '@nestjs/common';
import { Rate360Controller } from './rate360.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { Rate360Service } from './rate360.service';

@Module({
  controllers: [Rate360Controller],
  providers: [PrismaService, Rate360Service],
})
export class Rate360Module {}
