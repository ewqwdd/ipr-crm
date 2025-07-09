import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { FilesService } from './files.service';

@Module({
  providers: [PrismaService, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
