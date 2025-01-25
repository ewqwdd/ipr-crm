import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaService } from 'src/utils/db/prisma.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService],
})
export class TeamsModule {}
