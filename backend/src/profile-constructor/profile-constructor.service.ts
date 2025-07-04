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
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

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
        skipHint: data.hints?.[0],
        skipValue: data.values?.[0],
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

  async removeCompetencyBlockFromSpec(id: number, specId: number) {
    return this.prismaService.competencyBlock.update({
      where: {
        id,
      },
      data: {
        specs: {
          disconnect: {
            id: specId,
          },
        },
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
                skipHint: data.hints?.[0],
                hint1: data.hints?.[1],
                hint2: data.hints?.[2],
                hint3: data.hints?.[3],
                hint4: data.hints?.[4],
                hint5: data.hints?.[5],
              }
            : {}),
          ...(data.values
            ? {
                skipValue: data.values?.[0],
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
        skipHint: hints?.[0],
        skipValue: values?.[0],
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

        const blocksToClone = await tx.competencyBlock.findMany({
          where: { archived: false },
          include: {
            competencies: {
              include: {
                indicators: {
                  orderBy: {
                    id: 'asc',
                  },
                },
              },
              orderBy: {
                id: 'asc',
              },
            },
            specs: {
              select: {
                id: true,
              },
            },
            profileStrcuctureFoldersSpec: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        });

        // Архивация
        await tx.competencyBlock.updateMany({
          where: { archived: false },
          data: { archived: true, archivedDate: date },
        });

        await tx.competency.updateMany({
          where: { archived: false },
          data: { archived: true, archivedDate: date },
        });

        await tx.indicator.updateMany({
          where: { archived: false },
          data: { archived: true, archivedDate: date },
        });

        // Подготовка данных для массовой вставки
        const newBlocksData = blocksToClone.map((block, index) => ({
          name: block.name,
          type: block.type,
          archived: false,
          order: index,
        }));

        // Создаём новые блоки компетенций
        await tx.competencyBlock.createMany({
          data: newBlocksData,
        });

        // Получаем созданные блоки (Prisma не возвращает id при `createMany`)
        const createdBlocks = await tx.competencyBlock.findMany({
          where: { archived: false },
          orderBy: {
            order: 'asc',
          },
        });

        // Словарь соответствий старых и новых блоков
        const blockIdMap = new Map(
          blocksToClone.map((oldBlock, index) => {
            if (oldBlock.name !== createdBlocks[index]?.name)
              throw new Error(
                `Block names do not match: ${oldBlock.name} !== ${createdBlocks[index]?.name}`,
              );
            return [oldBlock.id, createdBlocks[index]?.id];
          }),
        );

        // Обновляем связи с новыми блоками в спецификациях
        for (const block of blocksToClone) {
          const newBlockId = blockIdMap.get(block.id);
          if (newBlockId) {
            await tx.competencyBlock.update({
              where: { id: newBlockId },
              data: {
                specs: {
                  connect: block.specs.map((spec) => ({
                    id: spec.id,
                  })),
                },
                profileStrcuctureFoldersSpec: {
                  connect: block.profileStrcuctureFoldersSpec.map((folder) => ({
                    id: folder.id,
                  })),
                },
              },
            });
          }
        }

        let competencyOrder = 0;

        const newCompetenciesData = blocksToClone
          .flatMap((block) =>
            block.competencies.map((comp) => ({
              name: comp.name,
              blockId: blockIdMap.get(comp.blockId) || undefined,
              archived: false,
              id: comp.id,
              order: competencyOrder++,
            })),
          )
          .sort((a, b) => a.order - b.order);

        // Новые компетенции
        await tx.competency.createMany({
          data: newCompetenciesData.map(({ id, ...rest }) => rest),
        });

        // Созданные компетенции
        const createdCompetencies = await tx.competency.findMany({
          where: { archived: false },
          orderBy: {
            order: 'asc',
          },
        });

        // Map старых и новых компетенций
        const competencyIdMap = new Map(
          newCompetenciesData.map((oldComp, index) => {
            if (oldComp.name !== createdCompetencies[index]?.name)
              throw new Error(
                `Competency names do not match: ${oldComp.name} !== ${createdCompetencies[index]?.name}`,
              );
            return [oldComp.id, createdCompetencies[index]?.id];
          }),
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

        let indicatorOrder = 0;
        // Подготовка данных для индикаторов
        const newIndicatorsData = blocksToClone
          .flatMap((block) =>
            block.competencies.flatMap((comp) =>
              comp.indicators.map((indicator) => ({
                name: indicator.name,
                description: indicator.description,
                competencyId: competencyIdMap.get(comp.id) || undefined,
                boundary: indicator.boundary,
                archived: false,
                id: indicator.id,
                skipHint: indicator.skipHint,
                skipValue: indicator.skipValue,
                hint1: indicator.hint1,
                hint2: indicator.hint2,
                hint3: indicator.hint3,
                hint4: indicator.hint4,
                hint5: indicator.hint5,
                order: indicatorOrder++,
              })),
            ),
          )
          .sort((a, b) => a.order - b.order);

        // Создаём индикаторы
        if (newIndicatorsData.length > 0) {
          await tx.indicator.createMany({
            data: newIndicatorsData.map(({ id, ...rest }) => rest),
          });
        }

        // Получаем созданные индикаторы
        const createdIndicators = await tx.indicator.findMany({
          where: { archived: false },
          orderBy: {
            order: 'asc',
          },
        });

        // Map соответствий старых и новых индикаторов
        const indicatorIdMap = new Map(
          newIndicatorsData.map((oldInd, index) => {
            if (oldInd.name !== createdIndicators[index]?.name)
              throw new Error(
                `Indicator names do not match: ${oldInd.name} !== ${createdIndicators[index]?.name}`,
              );
            return [oldInd.id, createdIndicators[index]?.id];
          }),
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
        timeout: 180000,
        maxWait: 180000, // 3 minutes
        isolationLevel: 'Serializable',
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
        skipHint: data.hints?.[0],
        hint1: data.hints?.[1],
        hint2: data.hints?.[2],
        hint3: data.hints?.[3],
        hint4: data.hints?.[4],
        hint5: data.hints?.[5],
      },
    });

    return updated;
  }

  async restoreArchivedVersion(id: number) {
    const version = await this.prismaService.profileVersion.findUnique({
      where: {
        id,
      },
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    return await this.prismaService.$transaction(
      async (tx) => {
        const newDate = new Date();
        const newVersion = await tx.profileVersion.create({
          data: {
            date: newDate,
          },
        });

        await tx.competencyBlock.updateMany({
          where: {
            archived: false,
          },
          data: {
            archived: true,
            archivedDate: newDate,
          },
        });

        await tx.competency.updateMany({
          where: {
            archived: false,
          },
          data: {
            archived: true,
            archivedDate: newDate,
          },
        });

        await tx.indicator.updateMany({
          where: {
            archived: false,
          },
          data: {
            archived: true,
            archivedDate: newDate,
          },
        });

        await tx.competencyBlock.updateMany({
          where: {
            archived: true,
            archivedDate: version.date,
          },
          data: {
            archived: false,
            archivedDate: null,
          },
        });
        await tx.competency.updateMany({
          where: {
            archived: true,
            archivedDate: version.date,
          },
          data: {
            archived: false,
            archivedDate: null,
          },
        });
        await tx.indicator.updateMany({
          where: {
            archived: true,
            archivedDate: version.date,
          },
          data: {
            archived: false,
            archivedDate: null,
          },
        });

        await tx.profileVersion.delete({
          where: {
            id: version.id,
          },
        });

        return newVersion;
      },
      {
        isolationLevel: 'RepeatableRead',
      },
    );
  }

  // Каждый день в 00:00
  @Cron('0 0 * * *', {
    waitForCompletion: true,
  })
  async handleCron() {
    const data = await this.prismaService.competencyBlock.findMany({
      where: {
        archived: false,
      },
      include: {
        competencies: {
          include: {
            indicators: {
              include: {
                materials: true,
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
        profileStrcuctureFoldersSpec: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const base = path.resolve(__dirname, '..', '..', 'backups');

    if (!fs.existsSync(base)) {
      fs.mkdirSync(base, { recursive: true });
    }

    const fileName = `collection-backup-${new Date().toISOString().replace(/:/g, '-')}.json`;
    const filePath = path.join(base, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
