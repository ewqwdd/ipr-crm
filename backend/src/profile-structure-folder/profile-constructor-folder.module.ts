import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ProfileStructureFolderController } from './profile-constructor-folder.controller';
import { ProfileConstructorFolderService } from './profile-constructor-folder.service';

@Module({
  controllers: [ProfileStructureFolderController],
  providers: [PrismaService, ProfileConstructorFolderService],
})
export class ProfileStructureFolderModule {}
