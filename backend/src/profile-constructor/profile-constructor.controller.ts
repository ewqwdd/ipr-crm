import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ProfileConstructorService } from './profile-constructor.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateCompetencyBlockDto } from './dto/create-competency-block.dto';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { createMaterialCompetencyDto } from './dto/create-material-competency.dto';
import { createMaterialIndicatorDto } from './dto/create-material-indicator.dto';
import { AddBlockToSpecDto } from './dto/add-block-to-spec.dto';

@Controller('profile-constructor')
export class ProfileConstructorController {
  constructor(
    private readonly profileConstructorService: ProfileConstructorService,
  ) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async profileConstructor() {
    const profileConstructor = await this.profileConstructorService.findAll();
    return profileConstructor;
  }

  @Post('/competency-block')
  @UseGuards(AdminGuard)
  async createCompetencyBlock(@Body() data: CreateCompetencyBlockDto) {
    return this.profileConstructorService.createCompetencyBlock(data);
  }

  @Post('/competency')
  @UseGuards(AdminGuard)
  async createCompetency(@Body() data: CreateCompetencyDto) {
    return this.profileConstructorService.createCompetency(data);
  }

  @Post('/indicator')
  @UseGuards(AdminGuard)
  async createIndidcator(@Body() data: CreateIndicatorDto) {
    return this.profileConstructorService.createIndicator(data);
  }

  @Delete('/competency-block/:id')
  @UseGuards(AdminGuard)
  async deleteCompetencyBlock(id: number) {
    return this.profileConstructorService.deleteCompetencyBlock(id);
  }

  @Delete('/competency/:id')
  @UseGuards(AdminGuard)
  async deleteCompetency(id: number) {
    return this.profileConstructorService.deleteCompetency(id);
  }

  @Delete('/indicator/:id')
  @UseGuards(AdminGuard)
  async deleteIndicator(id: number) {
    return this.profileConstructorService.deleteIndicator(id);
  }

  @Post('/competency/material')
  @UseGuards(AdminGuard)
  async createMaterialCompetency(@Body() data: createMaterialCompetencyDto) {
    return this.profileConstructorService.createMaterialCompetency(data);
  }

  @Post('/indicator/material')
  @UseGuards(AdminGuard)
  async createMaterialIndicator(@Body() data: createMaterialIndicatorDto) {
    return this.profileConstructorService.createMaterialIndicator(data);
  }

  @Post('/add-block-to-spec')
  @UseGuards(AdminGuard)
  async addBlockToSpec(@Body() data: AddBlockToSpecDto) {
    return this.profileConstructorService.addBlockToSpec(data);
  }
  
}
