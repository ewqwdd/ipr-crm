import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TeamsController],
  imports: [UsersModule],
  providers: [TeamsService, PrismaService],
})
export class TeamsModule {}
