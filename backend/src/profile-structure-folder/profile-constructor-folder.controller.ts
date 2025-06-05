import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProfileConstructorFolderService } from './profile-constructor-folder.service';
import { CreateProductFolderDto } from './dto/create-product-folder.dto';
import { UpdateProductFolderDto } from './dto/update-product-folder.dto';
import { CreateTeamFolderDto } from './dto/create-team-folder.dto';
import { UpdateTeamFolderDto } from './dto/update-team-folder.dto';
import { CreateSpecFolderDto } from './dto/create-spec-folder.dto';
import { UpdateSpecFolderDto } from './dto/update-spec-folder.dto';
import { SetCompetencyBlocksForSpecFolderDto } from './dto/set-comeptency-blocks-for-spec-folder.dto';

@Controller('profile-structure-folder')
export class ProfileStructureFolderController {
  constructor(
    private readonly folderService: ProfileConstructorFolderService,
  ) {}

  // Получить всю структуру
  @Get()
  getAll() {
    return this.folderService.getProfileStructureFolders();
  }

  // --- Product Folders ---

  @Post('product')
  createProduct(@Body() dto: CreateProductFolderDto) {
    return this.folderService.createProductFolder(dto);
  }

  @Patch('product/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductFolderDto,
  ) {
    return this.folderService.updateProductFolder(id, dto);
  }

  @Delete('product/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.deleteProductFolder(id);
  }

  // --- Team Folders ---

  @Post('team')
  createTeam(@Body() dto: CreateTeamFolderDto) {
    return this.folderService.createTeamFolder(dto);
  }

  @Patch('team/:id')
  updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamFolderDto,
  ) {
    return this.folderService.updateTeamFolder(id, dto);
  }

  @Delete('team/:id')
  deleteTeam(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.deleteTeamFolder(id);
  }

  // --- Spec Folders ---

  @Post('spec')
  createSpec(@Body() dto: CreateSpecFolderDto) {
    return this.folderService.createSpecFolder(dto);
  }

  @Patch('spec/:id')
  updateSpec(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpecFolderDto,
  ) {
    return this.folderService.updateSpecFolder(id, dto);
  }

  @Delete('spec/:id')
  deleteSpec(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.deleteSpecFolder(id);
  }

  @Post('spec/:id/competency-blocks')
  setCompetencyBlocksForSpecFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetCompetencyBlocksForSpecFolderDto,
  ) {
    return this.folderService.setCompetencyBlocksForSpecFolder(id, dto);
  }

  @Delete('spec/:specId/competency-blocks/:blockId')
  removeCompetencyBlock(
    @Param('specId', ParseIntPipe) specId: number,
    @Param('blockId', ParseIntPipe) blockId: number,
  ) {
    return this.folderService.removeCompetencyBlockFromSpecFolder(
      specId,
      blockId,
    );
  }
}
