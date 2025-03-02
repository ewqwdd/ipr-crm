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
      where: {
        archived: false,
      },
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
        boundary: data.boundary,
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

  async editIndicator(id: number, name?: string, boundary?: number) {
    return this.prismaService.indicator.update({
      where: {
        id,
      },
      data: {
        name,
        boundary,
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

  async archiveAndCloneAll() {
    await this.prismaService.$transaction(async (tx) => {
      const date = new Date();

      await tx.profileVersion.create({
        data: {
          date,
        },
      });

      // Архивируем все блоки компетенций
      await tx.competencyBlock.updateMany({
        where: { archived: false },
        data: { archived: true, archivedDate: date },
      });

      // Архивируем компетенции
      await tx.competency.updateMany({
        where: { archived: false },
        data: { archived: true, archivedDate: date },
      });

      // Архивируем индикаторы
      await tx.indicator.updateMany({
        where: { archived: false },
        data: { archived: true, archivedDate: date },
      });

      // Получаем данные для копирования
      const blocksToClone = await tx.competencyBlock.findMany({
        where: { archived: true, archivedDate: date },
        include: {
          competencies: {
            include: { indicators: true },
          },
        },
      });

      // Подготовка данных для массовой вставки
      const newBlocksData = blocksToClone.map((block) => ({
        name: block.name,
        specId: block.specId,
        type: block.type,
        archived: false,
      }));

      // Создаём новые блоки компетенций
      const newBlocks = await tx.competencyBlock.createMany({
        data: newBlocksData,
        skipDuplicates: true, // Предотвращаем дубли
      });

      // Получаем созданные блоки (Prisma не возвращает id при `createMany`)
      const createdBlocks = await tx.competencyBlock.findMany({
        where: { archived: false },
      });

      // Словарь соответствий старых и новых блоков
      const blockIdMap = new Map(
        blocksToClone.map((oldBlock, index) => [
          oldBlock.id,
          createdBlocks[index]?.id,
        ]),
      );

      // Подготовка данных для новых компетенций
      const newCompetenciesData = blocksToClone.flatMap((block) =>
        block.competencies.map((comp) => ({
          name: comp.name,
          blockId: blockIdMap.get(block.id) || undefined,
          archived: false,
        })),
      );

      // Создаём новые компетенции
      const newCompetencies = await tx.competency.createMany({
        data: newCompetenciesData,
        skipDuplicates: true,
      });

      // Получаем созданные компетенции
      const createdCompetencies = await tx.competency.findMany({
        where: { archived: false },
      });

      // Словарь соответствий старых и новых компетенций
      const competencyIdMap = new Map(
        newCompetenciesData.map((oldComp, index) => [
          oldComp.name,
          createdCompetencies[index]?.id,
        ]),
      );

      // Подготовка данных для индикаторов
      const newIndicatorsData = blocksToClone.flatMap((block) =>
        block.competencies.flatMap((comp) =>
          comp.indicators.map((indicator) => ({
            name: indicator.name,
            description: indicator.description,
            competencyId: competencyIdMap.get(comp.name) || undefined,
            boundary: indicator.boundary,
            archived: false,
          })),
        ),
      );

      // Создаём индикаторы
      if (newIndicatorsData.length > 0) {
        await tx.indicator.createMany({
          data: newIndicatorsData,
          skipDuplicates: true,
        });
      }
    });
  }

  async getVersion() {
    return this.prismaService.profileVersion.findFirst({
      orderBy: {
        date: 'desc',
      },
    });
  }
}
