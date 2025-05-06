import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileConstructorService } from './profile-constructor.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { CreateCompetencyBlockDto } from './dto/create-competency-block.dto';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { createMaterialCompetencyDto } from './dto/create-material-competency.dto';
import { createMaterialIndicatorDto } from './dto/create-material-indicator.dto';
import { AddBlockToSpecDto } from './dto/add-block-to-spec.dto';
import { EditDto } from './dto/edi.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { EditMaterialDto } from './dto/edit-material.dto';
import { EditIndicatorDto } from './dto/edit-indicator.dto';
import { EditMultipleBoundariesDto } from './dto/edit-multiple-boudaries.dto';
import { EditCompetencyDto } from './dto/edit-competency.dto';

@Controller('profile-constructor')
export class ProfileConstructorController {
  constructor(
    private readonly profileConstructorService: ProfileConstructorService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
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
  async deleteCompetencyBlock(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
  ) {
    return this.profileConstructorService.deleteCompetencyBlock(id);
  }

  @Post('/competency-block/:id/remove-from-spec/:specId')
  @UseGuards(AdminGuard)
  async removeCompetencyBlockFromSpec(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Param('specId', { transform: (v) => parseInt(v) }) specId: number,
  ) {
    return this.profileConstructorService.removeCompetencyBlockFromSpec(
      id,
      specId,
    );
  }

  @Delete('/competency/:id')
  @UseGuards(AdminGuard)
  async deleteCompetency(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
  ) {
    return this.profileConstructorService.deleteCompetency(id);
  }

  @Delete('/indicator/:id')
  @UseGuards(AdminGuard)
  async deleteIndicator(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
  ) {
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

  @Delete('/material/:id')
  @UseGuards(AdminGuard)
  async deleteMaterial(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
  ) {
    return this.profileConstructorService.deleteMaterial(id);
  }

  @Put('/material/:id')
  @UseGuards(AdminGuard)
  async editMaterial(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: EditMaterialDto,
  ) {
    return this.profileConstructorService.editMaterial(id, data);
  }

  @Post('/add-block-to-spec')
  @UseGuards(AdminGuard)
  async addBlockToSpec(@Body() data: AddBlockToSpecDto) {
    return this.profileConstructorService.addBlockToSpec(data);
  }

  @Put('/competency-block/:id')
  @UseGuards(AdminGuard)
  async updateCompetencyBlock(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: EditDto,
  ) {
    return this.profileConstructorService.editCompetencyBlock(id, data.name);
  }

  @Put('/competency/:id')
  @UseGuards(AdminGuard)
  async updateCompetency(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: EditCompetencyDto,
  ) {
    return this.profileConstructorService.editCompetency(id, data);
  }

  @Put('/indicator/:id')
  @UseGuards(AdminGuard)
  async updateIndicator(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: EditIndicatorDto,
  ) {
    return this.profileConstructorService.editIndicator(
      id,
      data.name,
      data.boundary,
      data.hints,
      data.values,
    );
  }

  @Post('/archive')
  @UseGuards(AdminGuard)
  async arcihve() {
    return this.profileConstructorService.archiveAndCloneAll();
  }

  @Get('/version')
  @UseGuards(AdminGuard)
  async version() {
    return this.profileConstructorService.getVersion();
  }

  @Get('/versions')
  @UseGuards(AdminGuard)
  async versions() {
    return this.profileConstructorService.getVersions();
  }

  @Get('/version/:id')
  @UseGuards(AdminGuard)
  async versionByDate(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
  ) {
    return this.profileConstructorService.getVersionById(id);
  }

  @Post('/competency/:id/boundary')
  @UseGuards(AdminGuard)
  async editCompetencyBoundary(
    @Param('id', { transform: (v) => parseInt(v) }) id: number,
    @Body() data: EditMultipleBoundariesDto,
  ) {
    return this.profileConstructorService.editMultipleBoundaries(id, data);
  }
}
