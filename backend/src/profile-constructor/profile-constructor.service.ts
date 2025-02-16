import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateCompetencyBlockDto } from './dto/create-competency-block.dto';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { createMaterialCompetencyDto } from './dto/create-material-competency.dto';
import { createMaterialIndicatorDto } from './dto/create-material-indicator.dto';
import { AddBlockToSpecDto } from './dto/add-block-to-spec.dto';
import { EditMaterialDto } from './dto/edit-material.dto';

@Injectable()
export class ProfileConstructorService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.competencyBlock.findMany({
      include: {
        competencies: {
          include: {
            materials: {
              select: {
                material: true,
              },
            },
            indicators: {
              include: {
                materials: {
                  select: {
                    material: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createCompetencyBlock(data: CreateCompetencyBlockDto) {
    return this.prismaService.competencyBlock.create({
      data: {
        name: data.name,
        type: data.type,
        ...(data.specId
          ? {
              spec: {
                connect: {
                  id: data.specId,
                },
              },
            }
          : {}),
      },
    });
  }

  async createCompetency(data: CreateCompetencyDto) {
    return this.prismaService.competency.create({
      data: {
        name: data.name,
        block: {
          connect: {
            id: data.blockId,
          },
        },
      },
    });
  }

  async createIndicator(data: CreateIndicatorDto) {
    return this.prismaService.indicator.create({
      data: {
        name: data.name,
        competency: {
          connect: {
            id: data.competencyId,
          },
        },
        description: data.description,
      },
    });
  }

  async createMaterialCompetency(data: createMaterialCompetencyDto) {
    return this.prismaService.material.create({
      data: {
        name: data.name,
        contentType: data.contentType,
        description: data.description,
        url: data.url,
        level: data.level,
        competencyMaterials: {
          create: {
            competencyId: data.competencyId,
          },
        },
      },
    });
  }

  async createMaterialIndicator(data: createMaterialIndicatorDto) {
    return this.prismaService.material.create({
      data: {
        name: data.name,
        contentType: data.contentType,
        description: data.description,
        url: data.url,
        level: data.level,
        indicatorMaterials: {
          create: {
            indicatorId: data.indicatorId,
          },
        },
      },
    });
  }

  async deleteMaterial(id: number) {
    return this.prismaService.material.delete({
      where: {
        id,
      },
    });
  }

  async deleteCompetencyBlock(id: number) {
    return this.prismaService.competencyBlock.delete({
      where: {
        id,
      },
    });
  }

  async deleteCompetency(id: number) {
    return this.prismaService.competency.delete({
      where: {
        id,
      },
    });
  }

  async deleteIndicator(id: number) {
    return this.prismaService.indicator.delete({
      where: {
        id,
      },
    });
  }

  async editCompetencyBlock(id: number, name?: string) {
    return this.prismaService.competencyBlock.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async editCompetency(id: number, name?: string) {
    return this.prismaService.competency.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async editIndicator(id: number, name?: string) {
    return this.prismaService.indicator.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async addBlockToSpec({ specId, blockIds }: AddBlockToSpecDto) {
    return await this.prismaService.spec.update({
      where: {
        id: specId,
      },
      data: {
        competencyBlocks: {
          set: blockIds.map((id) => ({ id })),
        },
      },
    });
  }

  async editMaterial(id: number, data: EditMaterialDto) {
    return this.prismaService.material.update({
      where: {
        id,
      },
      data,
    });
  }

}
