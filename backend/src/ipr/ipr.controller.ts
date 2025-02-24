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

@Controller('ipr')
export class IprController {
  constructor(private readonly iprService: IprService) {}

  @Get('/360/:id')
  @UseGuards(AuthGuard)
  async findOneby360Id(id: number) {
    return this.iprService.findOneby360Id(id);
  }

  @Post('/360/:rateId')
  @UseGuards(AdminGuard)
  async create(rateId: number) {
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
  ) {
    return this.iprService.update(id, { priority: data.priority });
  }

  @Post('/task/status')
  @UseGuards(AdminGuard)
  async setStatus(@Param('id') id: number, @Body() data: SetStatusDto) {
    return this.iprService.update(id, { status: data.status });
  }

  @Post('/:id/transfer-to-general')
  @UseGuards(AdminGuard)
  async transferToGeneral(@Body() data: TransferToDto) {
    return this.iprService.transferToGeneral(data.ids);
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
}
