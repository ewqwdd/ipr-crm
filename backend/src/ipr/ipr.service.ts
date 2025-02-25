import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GrowthPlanTask,
  IndividualGrowthPlan,
  TaskMaterialType,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { PrismaService } from 'src/utils/db/prisma.service';
import { AddTaskDto } from './dto/add-task.dto';

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
        rate360: {
          include: {
            spec: {
              select: {
                name: true,
              },
            },
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
                avg < (indicator.boundary ?? 3)
                  ? TaskMaterialType.OBVIOUS
                  : TaskMaterialType.OTHER,
              priority: TaskPriority.MEDIUM,
              status: TaskStatus.TO_DO,
              onBoard: avg < (indicator.boundary ?? 3),
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

  updatePlan(id: number, data: Partial<IndividualGrowthPlan>) {
    return this.prismaService.individualGrowthPlan.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async update(
    id: number,
    data: Partial<GrowthPlanTask>,
    session: GetSessionInfoDto,
  ) {
    const plan = await this.prismaService.individualGrowthPlan.findFirst({
      where: {
        tasks: {
          some: {
            id: id,
          },
        },
      },
    });

    if (session.role !== 'admin' && plan.userId !== session.id) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    return this.prismaService.growthPlanTask.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  transferToGeneral(ids: number[]) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        id: {
          in: ids,
        },
        competency: {
          NOT: null,
        },
      },
      data: {
        type: TaskMaterialType.GENERAL,
      },
    });
  }

  transferToOther(ids: number[]) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        id: {
          in: ids,
        },
        type: 'OBVIOUS',
        indicator: {
          isNot: null,
        },
      },
      data: {
        type: TaskMaterialType.OTHER,
      },
    });
  }

  transferToObvious(ids: number[]) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        id: {
          in: ids,
        },
        type: 'OTHER',
        indicator: {
          NOT: null,
        },
      },
      data: {
        type: TaskMaterialType.OBVIOUS,
      },
    });
  }

  deleteTasks(ids: number[]) {
    return this.prismaService.growthPlanTask.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  boardChange(ids: number[], onBoard: boolean) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        onBoard,
      },
    });
  }

  async setCurator(id: number, curatorId: number, competencyId: number) {
    await this.prismaService.growthPlanCurator.deleteMany({
      where: {
        competencyId,
        userId: curatorId,
        planId: id,
      },
    });

    return this.prismaService.individualGrowthPlan.update({
      where: {
        id: id,
      },
      data: {
        planCurators: {
          connect: {
            id: curatorId,
            competencyId,
          },
        },
      },
    });
  }

  async findAllTasks(userId: number, session: GetSessionInfoDto) {
    let result = () =>
      this.prismaService.growthPlanTask.findMany({
        where: {
          plan: {
            userId,
            archived: false,
          },
        },
        include: {
          material: true,
          competency: true,
          indicator: true,
        },
      });

    if (userId === session.id || session.role === 'admin') {
      return await result();
    }
    const teamCurator = await this.prismaService.team.findFirst({
      where: {
        curatorId: session.id,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (teamCurator) {
      return await result();
    }
    throw new ForbiddenException('У вас нет доступа к этому пользователю');
  }

  async addTask(data: AddTaskDto, clientInfo: GetSessionInfoDto) {
    const plan = await this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: data.planId,
        userId: data.userId,
      },
      include: {
        rate360: {
          include: {
            team: {
              include: {
                curator: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (
      plan.rate360.team.curator.id !== clientInfo.id ||
      clientInfo.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'You are not allowed to add tasks to this plan',
      );
    }

    const material = await this.prismaService.material.create({
      data: {
        name: data.name,
        contentType: data.contentType,
        description: '',
        level: 3,
        url: data.url,
        ...(data.competencyId
          ? {
              competencyMaterials: {
                create: { competencyId: data.competencyId },
              },
            }
          : {}),
        ...(data.indicatorId
          ? {
              indicatorMaterials: { create: { indicatorId: data.indicatorId } },
            }
          : {}),
        task: {
          create: {
            status: TaskStatus.TO_DO,
            priority: data.priority,
            type: data.taskType,
            competencyId: data.competencyId,
            planId: plan.id,
            ...(data.competencyId ? { competencyId: data.competencyId } : {}),
            ...(data.indicatorId ? { indicatorId: data.indicatorId } : {}),
            deadline: data.deadline,
            onBoard: data.taskType === TaskMaterialType.OBVIOUS,
          },
        },
      },
    });
    return material;
  }
}
