import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { PasswordService } from 'src/utils/password/password';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
