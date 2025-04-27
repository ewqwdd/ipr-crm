import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UsersAccessService } from 'src/users/users-access.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService, UsersAccessService],
})
export class TeamsModule {}
