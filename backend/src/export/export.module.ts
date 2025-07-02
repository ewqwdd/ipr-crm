import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExportController } from './export.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ExportService } from './export.service';

@Module({
  providers: [ExcelService, PrismaService, ExportService],
  exports: [ExcelService, ExportService],
  controllers: [ExportController],
})
export class ExportModule {}
