import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskMaterialType, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/utils/db/prisma.service';

@Injectable()
export class IprService {
  constructor(private prismaService: PrismaService) {}

  async findOneby360Id(id: number) {
    return this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: id,
      },
      include: {
        tasks: {
          include: {
            material: true,
            indicator: true,
            competency: true,
          },
        },
        mentor: true,
        user: true,
      },
    });
  }

  async create(rateId: number) {
    const rate360 = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
      },
      include: {
        spec: {
          include: {
            competencyBlocks: {
              include: {
                competencies: {
                  include: {
                    indicators: {
                      include: {
                        materials: true,
                      },
                    },
                    materials: true,
                  },
                },
              },
            },
          },
        },
        userRates: true,
        plan: true,
      },
    });

    if (!rate360) {
      throw new NotFoundException();
    }
    if (rate360.plan) {
      throw new ConflictException('Plan already exists');
    }

    const rates: Record<number, { sum: number; count: number }> = {};
    rate360.userRates.forEach((userRate) => {
      rates[userRate.indicatorId] = rates[userRate.indicatorId] || {
        sum: 0,
        count: 0,
      };
      rates[userRate.indicatorId].sum += userRate.rate;
      rates[userRate.indicatorId].count++;
    });

    const competencyTasks = rate360.spec.competencyBlocks.flatMap((block) => {
      return block.competencies.flatMap((competency) => {
        return competency.materials.map((material) => {
          return {
            materialId: material.materialId,
            competencyId: competency.id,
            type: TaskMaterialType.GENERAL,
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.TO_DO,
          };
        });
      });
    });

    const indicatorTasks = rate360.spec.competencyBlocks.flatMap((block) => {
      return block.competencies.flatMap((competency) => {
        return competency.indicators.flatMap((indicator) => {
          return indicator.materials.map((material) => {
            const rate = rates[indicator.id];
            const avg = rate.sum / rate.count;
            return {
              materialId: material.materialId,
              indicatorId: indicator.id,
              type:
                avg <= 3 ? TaskMaterialType.OBVIOUS : TaskMaterialType.OTHER,
              priority: TaskPriority.MEDIUM,
              status: TaskStatus.TO_DO,
              onBoard: avg <= 3,
            };
          });
        });
      });
    });

    const created = await this.prismaService.individualGrowthPlan.create({
      data: {
        rate360Id: rate360.id,
        goal: 'Goal',
        skillType: rate360.type,
        startDate: new Date(),
        status: 'ACTIVE',
        userId: rate360.userId,
        tasks: {
          create: [...competencyTasks, ...indicatorTasks],
        },
      },
    });

    return created;
  }
}
