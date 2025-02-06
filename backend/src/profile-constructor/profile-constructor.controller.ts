import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfileConstructorService } from './profile-constructor.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateCompetencyBlockDto } from './dto/create-competency-block.dto';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { createMaterialCompetencyDto } from './dto/create-material-competency.dto';
import { createMaterialIndicatorDto } from './dto/create-material-indicator.dto';

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
}
