import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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

@Controller('ipr')
export class IprController {
  constructor(private readonly iprService: IprService) {}

  @Get('/360/:id')
  @UseGuards(AuthGuard)
  async findOneby360Id(@Param('id') id: number) {
    return this.iprService.findOneby360Id(id);
  }

  @Post('/360/:rateId')
  @UseGuards(AdminGuard)
  async create(@Param('rateId') rateId: number) {
    console.log('rateId', rateId);
    return this.iprService.create(rateId);
  }

  @Post('360/:id/goal')
  @UseGuards(AdminGuard)
  async setGoal(@Param('id') id: number, @Body() data: SetGoalDto) {
    return this.iprService.updatePlan(id, { goal: data.goal });
  }

  @Post('/:id/priority')
  @UseGuards(AdminGuard)
  async setPriority(
    @Param('id') id: number,
    @Body() data: SetPriorityStatusDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.update(id, { priority: data.priority }, sessionInfo);
  }

  @Post('/task/status')
  @UseGuards(AuthGuard)
  async setStatus(
    @Body() data: SetStatusDto,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    return this.iprService.update(
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
    return this.iprService.update(
      data.id,
      { deadline: new Date(data.deadline) },
      sessionInfo,
    );
  }

  @Post('/task/transfer-to-other')
  @UseGuards(AdminGuard)
  async transferToOther(@Body() data: TransferToDto) {
    return this.iprService.transferToOther(data.ids);
  }

  @Post('/task/transfer-to-obvious')
  @UseGuards(AdminGuard)
  async transferToObvious(@Body() data: TransferToDto) {
    return this.iprService.transferToObvious(data.ids);
  }

  @Delete('/task')
  @UseGuards(AdminGuard)
  async deleteTask(@Body() data: TransferToDto) {
    return this.iprService.deleteTasks(data.ids);
  }

  @Post('/task/add-to-board')
  @UseGuards(AdminGuard)
  async addToBoard(@Body() data: TransferToDto) {
    return this.iprService.boardChange(data.ids, true);
  }

  @Post('/task/remove-from-board')
  @UseGuards(AdminGuard)
  async removeFromBoard(@Body() data: TransferToDto) {
    return this.iprService.boardChange(data.ids, false);
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
  async findAll(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    return this.iprService.findAll(sessionInfo);
  }
}
