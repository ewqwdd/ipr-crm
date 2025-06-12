import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IprService } from './ipr.service';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { SetPriorityStatusDto } from './dto/set-priority-status.dto';
import { SetStatusDto } from './dto/set-status.dto';
import { TransferToDto } from './dto/transfer/transfer-to.dto';
import { SetGoalDto } from './dto/set-goal-dto';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { SetDeadlineDto } from './dto/set-deadline.dto';
import { RemoveFromBoardDto } from './dto/remove-from-board.dto';
import { IprFiltersDto } from './dto/ipr-filters.dto';
import { DeleteIprsDto } from './dto/delete-iprs.dto';

@Controller('ipr')
export class IprController {
  constructor(private readonly iprService: IprService) {}

  @Get('/360/:id')
  @UseGuards(AuthGuard)
  async findOneby360Id(
    @Param('id') id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.findOneby360Id(id, sessionInfo);
  }

  @Delete('/')
  @UseGuards(AdminGuard)
  async deleteIpr(@Body() data: DeleteIprsDto) {
    return this.iprService.deleteIprs(data);
  }

  @Post('/360/:rateId')
  @UseGuards(AuthGuard)
  async create(
    @Param('rateId') rateId: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.create(rateId, sessionInfo);
  }

  @Post('360/:id/goal')
  @UseGuards(AuthGuard)
  async setGoal(
    @Param('id') id: number,
    @Body() data: SetGoalDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.updatePlan(id, { goal: data.goal }, sessionInfo);
  }

  @Post('/:id/priority')
  @UseGuards(AuthGuard)
  async setPriority(
    @Param('id') id: number,
    @Body() data: SetPriorityStatusDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.updateTask(
      id,
      { priority: data.priority },
      sessionInfo,
    );
  }

  @Post('/task/status')
  @UseGuards(AuthGuard)
  async setStatus(
    @Body() data: SetStatusDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.updateTask(
      data.id,
      { status: data.status },
      sessionInfo,
    );
  }

  @Post('/task/deadline')
  @UseGuards(AuthGuard)
  async setDeadline(
    @Body() data: SetDeadlineDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.updateTask(
      data.id,
      { deadline: data.deadline ? new Date(data.deadline) : null },
      sessionInfo,
    );
  }

  @Post('/task/transfer-to-other')
  @UseGuards(AuthGuard)
  async transferToOther(
    @Body() data: TransferToDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.transferToOther(data.ids, sessionInfo);
  }

  @Post('/task/transfer-to-obvious')
  @UseGuards(AuthGuard)
  async transferToObvious(
    @Body() data: TransferToDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.transferToObvious(data.ids, sessionInfo);
  }

  @Delete('/task')
  @UseGuards(AuthGuard)
  async deleteTask(
    @Body() data: TransferToDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.deleteTasks(data.ids, sessionInfo);
  }

  @Post('/task/add-to-board')
  @UseGuards(AuthGuard)
  async addToBoard(
    @Body() data: TransferToDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.boardChange(data.ids, true, sessionInfo);
  }

  @Post('/task/remove-from-board')
  @UseGuards(AdminGuard)
  async removeFromBoard(
    @Body() data: RemoveFromBoardDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    const isAccess = await this.iprService.checkBoardAccess(
      data.id,
      sessionInfo,
    );
    if (!isAccess) throw new ForbiddenException();
    return this.iprService.boardChangeSingle(data.id, false);
  }

  @Get('/task/board')
  @UseGuards(AuthGuard)
  async getBoard(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.iprService.findAllTasks(sessionInfo.id, sessionInfo);
  }

  @Get('/task/board/:id')
  @UseGuards(AuthGuard)
  async getBoardByUserId(
    @Param('id') id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.findAllTasks(id, sessionInfo);
  }

  @Post('/task')
  @UseGuards(AuthGuard)
  async addTask(
    @Body() data: AddTaskDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.addTask(data, sessionInfo);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async findAll(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Query() params: IprFiltersDto,
  ) {
    if (params.subbordinatesOnly) {
      return await this.iprService.findAllSubbordinates(sessionInfo, params);
    }
    return this.iprService.findAll(sessionInfo, params);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard)
  async findIprById(
    @Param('id') id: number,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.findUserIprById(id, sessionInfo);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async finduserIprMany(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Query() params: IprFiltersDto,
  ) {
    return this.iprService.finduserIprMany(sessionInfo, params);
  }

  @Get('/:id/competency-blocks')
  @UseGuards(AuthGuard)
  async findCompetencyBlocks(
    @Param('id', { transform: (v: string) => parseInt(v) }) id: number,
  ) {
    return this.iprService.findCompetencyBlocksByIpr(id);
  }
}
