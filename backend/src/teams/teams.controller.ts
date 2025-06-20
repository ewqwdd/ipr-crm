import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { TeamsService } from './teams.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { LeaveTeamDto } from './dto/leave-team.dto';
import { SetTeamUserSpecs } from './dto/set-team-user-specs';
import { AddTeamUserDto } from './dto/add-team-users.dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.teamsService.findAll(sessionInfo);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(
    @Body() { description, name, parentTeamId, curatorId }: CreateTeamDto,
  ) {
    return this.teamsService.create(name, description, parentTeamId, curatorId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/leave')
  @UseGuards(AdminGuard)
  async leaveTeam(@Body() body: LeaveTeamDto) {
    return this.teamsService.leaveTeam(body.userId, body.teamId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/curators/:id')
  @UseGuards(AuthGuard)
  async removeCurator(
    @Param('id') id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.teamsService.curatorRemove(id, sessionInfo);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/curators/:id')
  @UseGuards(AuthGuard)
  async addCurator(
    @Param('id') id: number,
    @Body() body: { curatorId: number },
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.teamsService.setCurator(id, body.curatorId, sessionInfo);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    return this.teamsService.findOne(id);
  }

  @Post('/users')
  @UseGuards(AuthGuard)
  async addUsers(
    @Body() body: AddTeamUserDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.teamsService.addTeamUsers(
      body.teamId,
      body.userIds,
      sessionInfo,
    );
  }

  @Post('/specs')
  @UseGuards(AuthGuard)
  async addSpec(
    @Body() body: SetTeamUserSpecs,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.teamsService.setTeamUserSpecs(body, sessionInfo);
  }

  @Post('/:id')
  @UseGuards(AdminGuard)
  async update(@Body() body: UpdateTeamDto, @Param('id') id: number) {
    return this.teamsService.updateTeam(id, body);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return this.teamsService.remove(id);
  }

  @Delete('/:id/users/:userId')
  @UseGuards(AuthGuard)
  async removeUser(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @SessionInfo() sessionInfo,
  ) {
    return this.teamsService.removeTeamUsers(id, userId, sessionInfo);
  }
}
