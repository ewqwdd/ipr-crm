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
import { AuthGuard } from 'src/auth/auth.guard';
import { TeamsService } from './teams.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { LeaveTeamDto } from './dto/leave-team.dto';
import { SetTeamUserSpecs } from './dto/set-team-user-specs';
import { AddTeamUserDto } from './dto/add-team-users.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.teamsService.findAll();
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
  @UseGuards(AdminGuard)
  async removeCurator(@Param('id') id: number) {
    return this.teamsService.curatorRemove(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/curators/:id')
  @UseGuards(AdminGuard)
  async addCurator(
    @Param('id') id: number,
    @Body() body: { curatorId: number },
  ) {
    return this.teamsService.setCurator(id, body.curatorId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number) {
    return this.teamsService.findOne(id);
  }

  @Post('/users')
  @UseGuards(AdminGuard)
  async addUsers(@Body() body: AddTeamUserDto) {
    return this.teamsService.addTeamUsers(body.teamId, body.userIds);
  }

  @Post('/specs')
  @UseGuards(AdminGuard)
  async addSpec(@Body() body: SetTeamUserSpecs) {
    return this.teamsService.setTeamUserSpecs(body);
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
}
