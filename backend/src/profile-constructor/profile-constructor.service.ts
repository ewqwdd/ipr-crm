import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateCompetencyBlockDto } from './dto/create-competency-block.dto';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { createMaterialCompetencyDto } from './dto/create-material-competency.dto';
import { createMaterialIndicatorDto } from './dto/create-material-indicator.dto';
import { AddBlockToSpecDto } from './dto/add-block-to-spec.dto';
import { EditMaterialDto } from './dto/edit-material.dto';
import { HintsDto } from './dto/hints.dto';
import { EditMultipleBoundariesDto } from './dto/edit-multiple-boudaries.dto';
import { EditCompetencyDto } from './dto/edit-competency.dto';
import { ValuesDto } from './dto/values.dto';

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
              orderBy: {
                id: 'asc',
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
      orderBy: {
        id: 'asc',
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
        ...(data.indicators
          ? {
              indicators: {
                createMany: {
                  data: data.indicators?.map((name) => ({ name })),
                },
              },
            }
          : {}),
      },
    });
  }

  async createIndicator(data: CreateIndicatorDto) {
    return this.prismaService.indicator.createMany({
      data: data.indicators.map((name) => ({
        name: name,
        competencyId: data.competencyId,
        boundary: data.boundary,
        description: data.description,
        hint1: data.hints?.[1],
        hint2: data.hints?.[2],
        hint3: data.hints?.[3],
        hint4: data.hints?.[4],
        hint5: data.hints?.[5],
        value1: data.values?.[1],
        value2: data.values?.[2],
        value3: data.values?.[3],
        value4: data.values?.[4],
        value5: data.values?.[5],
      })),
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

  async editCompetency(id: number, data: EditCompetencyDto) {
    await this.prismaService.competency.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
    if (data.hints || data.boundary) {
      await this.prismaService.indicator.updateMany({
        where: {
          competencyId: id,
          archived: false,
        },
        data: {
          ...(data.boundary ? { boundary: data.boundary } : {}),
          ...(data.hints
            ? {
                hint1: data.hints?.[1],
                hint2: data.hints?.[2],
                hint3: data.hints?.[3],
                hint4: data.hints?.[4],
                hint5: data.hints?.[5],
              }
            : {}),
          ...(data.values
            ? {
                value1: data.values?.[1],
                value2: data.values?.[2],
                value3: data.values?.[3],
                value4: data.values?.[4],
                value5: data.values?.[5],
              }
            : {}),
        },
      });
    }
  }

  async editIndicator(
    id: number,
    name?: string,
    boundary?: number,
    hints?: HintsDto,
    values?: ValuesDto,
  ) {
    const indicator = await this.prismaService.indicator.update({
      where: {
        id,
      },
      data: {
        name,
        boundary,
        hint1: hints?.[1],
        hint2: hints?.[2],
        hint3: hints?.[3],
        hint4: hints?.[4],
        hint5: hints?.[5],
        value1: values?.[1],
        value2: values?.[2],
        value3: values?.[3],
        value4: values?.[4],
        value5: values?.[5],
      },
    });

    return indicator;
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
    await this.prismaService.$transaction(
      async (tx) => {
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
            blockId: blockIdMap.get(comp.blockId) || undefined,
            archived: false,
            id: comp.id,
          })),
        );

        // Создаём новые компетенции
        const newCompetencies = await tx.competency.createMany({
          data: newCompetenciesData.map(({ id, ...rest }) => rest),
          skipDuplicates: true,
        });

        // Получаем созданные компетенции
        const createdCompetencies = await tx.competency.findMany({
          where: { archived: false },
        });

        // Словарь соответствий старых и новых компетенций
        const competencyIdMap = new Map(
          newCompetenciesData.map((oldComp, index) => [
            oldComp.id,
            createdCompetencies[index]?.id,
          ]),
        );
        const competencyMaterials = await tx.competencyMaterial.findMany({
          where: {
            competencyId: {
              in: Array.from(competencyIdMap.keys()),
            },
          },
        });

        await tx.competencyMaterial.createMany({
          data: competencyMaterials.map((material) => ({
            materialId: material.materialId,
            competencyId:
              competencyIdMap.get(material.competencyId) || undefined,
          })),
        });

        // Подготовка данных для индикаторов
        const newIndicatorsData = blocksToClone.flatMap((block) =>
          block.competencies.flatMap((comp) =>
            comp.indicators.map((indicator) => ({
              name: indicator.name,
              description: indicator.description,
              competencyId: competencyIdMap.get(comp.id) || undefined,
              boundary: indicator.boundary,
              archived: false,
              id: indicator.id,
              hint1: indicator.hint1,
              hint2: indicator.hint2,
              hint3: indicator.hint3,
              hint4: indicator.hint4,
              hint5: indicator.hint5,
            })),
          ),
        );

        // Создаём индикаторы
        if (newIndicatorsData.length > 0) {
          await tx.indicator.createMany({
            data: newIndicatorsData.map(({ id, ...rest }) => rest),
            skipDuplicates: true,
          });
        }

        // Получаем созданные индикаторы
        const createdIndicators = await tx.indicator.findMany({
          where: { archived: false },
        });

        // Словарь соответствий старых и новых индикаторов
        const indicatorIdMap = new Map(
          newIndicatorsData.map((oldInd, index) => [
            oldInd.id,
            createdIndicators[index]?.id,
          ]),
        );

        const indicatorMaterials = await tx.indicatorMaterial.findMany({
          where: {
            indicatorId: {
              in: Array.from(indicatorIdMap.keys()),
            },
          },
        });

        await tx.indicatorMaterial.createMany({
          skipDuplicates: true,
          data: indicatorMaterials.map((material) => ({
            materialId: material.materialId,
            indicatorId: indicatorIdMap.get(material.indicatorId) || undefined,
          })),
        });
      },
      {
        timeout: 60000,
        maxWait: 60000,
      },
    );
  }

  async getVersion() {
    return this.prismaService.profileVersion.findFirst({
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getVersions() {
    return this.prismaService.profileVersion.findMany({
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getVersionById(id: number) {
    const version = await this.prismaService.profileVersion.findUnique({
      where: {
        id,
      },
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    const blocks = await this.prismaService.competencyBlock.findMany({
      where: {
        archived: true,
        archivedDate: version.date,
      },
      include: {
        competencies: {
          include: {
            indicators: {
              include: {
                materials: {
                  include: {
                    material: true,
                  },
                },
              },
            },
            materials: {
              include: {
                material: true,
              },
            },
          },
        },
      },
    });

    return {
      blocks,
      date: version.date,
    };
  }

  async editMultipleBoundaries(id: number, data: EditMultipleBoundariesDto) {
    const updated = await this.prismaService.indicator.updateMany({
      where: {
        competencyId: id,
        archived: false,
      },
      data: {
        boundary: data.boundary,
        hint1: data.hints?.[1],
        hint2: data.hints?.[2],
        hint3: data.hints?.[3],
        hint4: data.hints?.[4],
        hint5: data.hints?.[5],
      },
    });

    return updated; // Возвращаем результат обновления
  }
}
