import { Module } from '@nestjs/common';
import { ProfileConstructorController } from './profile-constructor.controller';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ProfileConstructorService } from './profile-constructor.service';

@Module({
  controllers: [ProfileConstructorController],
  providers: [PrismaService, ProfileConstructorService],
})
export class ProfileConstructorModule {}
