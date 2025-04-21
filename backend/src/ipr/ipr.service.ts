import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GrowthPlanTask,
  IndividualGrowthPlan,
  Prisma,
  TaskMaterialType,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { PrismaService } from 'src/utils/db/prisma.service';
import { AddTaskDto } from './dto/add-task.dto';
import { NotificationsService } from 'src/utils/notifications/notifications.service';

@Injectable()
export class IprService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findOneby360Id(id: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: id,
        ...(sessionInfo.role !== 'admin'
          ? {
              rate360: {
                team: {
                  curatorId: sessionInfo.id,
                },
              },
            }
          : {}),
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

  async create(rateId: number, sessionInfo: GetSessionInfoDto) {
    const rate360 = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        ...(sessionInfo.role !== 'admin'
          ? {
              team: {
                curatorId: sessionInfo.id,
              },
            }
          : {}),
      },
      include: {
        spec: true,
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
        userRates: true,
        plan: true,
        evaluators: true,
        team: {
          include: {
            curator: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
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

    const competencyTasks = rate360.competencyBlocks.flatMap((block) => {
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

    const indicatorTasks = rate360.competencyBlocks.flatMap((block) => {
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
        goal: '',
        skillType: rate360.type,
        startDate: new Date(),
        status: 'ACTIVE',
        userId: rate360.userId,
        mentorId: rate360.team.curator.id,
        tasks: {
          create: [...competencyTasks, ...indicatorTasks],
        },
      },
    });

    await this.prismaService.rate360.update({
      where: {
        id: rate360.id,
      },
      data: {
        finished: true,
      },
    });

    await this.notificationsService.sendIprAssignedNotification(
      created.userId,
      created.id,
    );

    return created;
  }

  updatePlan(
    id: number,
    data: Partial<IndividualGrowthPlan>,
    sessionInfo: GetSessionInfoDto,
  ) {
    const filters = {
      rate360Id: id,
    } as Prisma.IndividualGrowthPlanWhereUniqueInput;

    if (sessionInfo.role !== 'admin') {
      filters.OR = [
        {
          rate360: {
            team: {
              curatorId: sessionInfo.id,
            },
          },
        },
        {
          planCurators: {
            some: {
              userId: sessionInfo.id,
            },
          },
        },
      ];
    }

    return this.prismaService.individualGrowthPlan.update({
      where: filters,
      data: data,
    });
  }

  async update(
    id: number,
    data: Partial<GrowthPlanTask>,
    session: GetSessionInfoDto,
  ) {
    const filters = {
      tasks: {
        some: {
          id: id,
        },
      },
    } as Prisma.IndividualGrowthPlanWhereInput;
    if (session.role !== 'admin') {
      filters.OR = [
        {
          rate360: {
            team: {
              curatorId: session.id,
            },
          },
        },
        {
          planCurators: {
            some: {
              userId: session.id,
            },
          },
        },
        {
          userId: session.id,
        },
      ];
    }

    const plan = await this.prismaService.individualGrowthPlan.findFirst({
      where: filters,
    });

    if (!plan) {
      throw new ForbiddenException('You are not allowed to update this task');
    }

    return this.prismaService.growthPlanTask.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  transferToGeneral(ids: number[], sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        ...this.taskMultiupleQuery(ids, sessionInfo),
        competency: {
          isNot: null,
        },
      },
      data: {
        type: TaskMaterialType.GENERAL,
      },
    });
  }

  transferToOther(ids: number[], sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        ...this.taskMultiupleQuery(ids, sessionInfo),
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

  transferToObvious(ids: number[], sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.updateMany({
      where: {
        ...this.taskMultiupleQuery(ids, sessionInfo),
        type: 'OTHER',
        indicator: {
          isNot: null,
        },
      },
      data: {
        type: TaskMaterialType.OBVIOUS,
        onBoard: true,
      },
    });
  }

  deleteTasks(ids: number[], sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.deleteMany({
      where: this.taskMultiupleQuery(ids, sessionInfo),
    });
  }

  boardChange(ids: number[], onBoard: boolean, sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.updateMany({
      where: this.taskMultiupleQuery(ids, sessionInfo),
      data: {
        onBoard,
      },
    });
  }

  boardChangeSingle(id: number, onBoard: boolean) {
    return this.prismaService.growthPlanTask.update({
      where: {
        id,
      },
      data: {
        onBoard: {
          set: onBoard,
        },
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
    const isAllTasksAccess = userId === session.id || session.role === 'admin';

    let result = () =>
      this.prismaService.growthPlanTask.findMany({
        where: {
          plan: {
            userId,
            archived: false,
            ...(isAllTasksAccess
              ? {}
              : {
                  rate360: {
                    team: {
                      curatorId: session.id,
                    },
                  },
                }),
          },
          onBoard: true,
        },
        include: {
          material: true,
          competency: true,
          indicator: true,
        },
      });

    return await result();
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
      plan.rate360.team.curator.id !== clientInfo.id &&
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

  async findAll(sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role === 'admin') {
      return this.prismaService.individualGrowthPlan.findMany({
        include: {
          user: true,
          mentor: true,
          rate360: {
            select: {
              team: {
                select: {
                  name: true,
                },
              },
            },
          },
          tasks: true,
          spec: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    }
    return this.prismaService.individualGrowthPlan.findMany({
      where: {
        OR: [
          {
            planCurators: {
              some: {
                userId: sessionInfo.id,
              },
            },
          },
          {
            rate360: {
              team: {
                curatorId: sessionInfo.id,
              },
            },
          },
        ],
      },
      include: {
        user: true,
        mentor: true,
        rate360: {
          select: {
            team: {
              select: {
                name: true,
              },
            },
          },
        },
        tasks: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async checkBoardAccess(taskId: number, sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role === 'admin') {
      return true;
    }
    const foundTask = await this.prismaService.growthPlanTask.findFirst({
      where: {
        id: taskId,
      },
      include: {
        plan: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (
      sessionInfo.id === foundTask.plan.userId &&
      foundTask.type !== TaskMaterialType.OBVIOUS
    ) {
      return true;
    } else if (sessionInfo.id === foundTask.plan.userId) return false;

    const curator = await this.prismaService.team.findFirst({
      where: {
        curatorId: sessionInfo.id,
        users: {
          some: {
            id: foundTask.plan.userId,
          },
        },
      },
    });

    if (curator) {
      return true;
    }

    return false;
  }

  // access checks
  taskMultiupleQuery(taskIds: number[], sessionInfo: GetSessionInfoDto) {
    return {
      id: {
        in: taskIds,
      },
      ...(sessionInfo.role !== 'admin'
        ? {
            plan: {
              rate360: {
                team: {
                  curatorId: sessionInfo.id,
                },
              },
            },
          }
        : {}),
    };
  }

  async findUserIprById(id: number, sessionInfo: GetSessionInfoDto) {
    const ipr = await this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: id,
        userId: sessionInfo.id,
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
            team: {
              select: {
                name: true,
                id: true,
                curator: {
                  select: {
                    username: true,
                    id: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        mentor: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    if (!ipr) throw new NotFoundException('Ipr not found');
    return ipr;
  }

  async finduserIprMany(sessionInfo: GetSessionInfoDto) {
    return this.prismaService.individualGrowthPlan.findMany({
      where: {
        userId: sessionInfo.id,
      },
      include: {
        tasks: true,
        rate360: {
          include: {
            spec: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}
