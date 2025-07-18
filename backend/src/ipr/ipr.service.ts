import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
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
import { IprFiltersDto } from './dto/ipr-filters.dto';
import { UsersAccessService } from 'src/users/users-access.service';
import { findAllIprInclude } from './constants';
import { DeleteIprsDto } from './dto/delete-iprs.dto';
import { NotificationsService } from 'src/notification/notifications.service';
import { SetDeputyDto } from './dto/set-deputy.dto';

@Injectable()
export class IprService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
    private usersAccessService: UsersAccessService,
  ) {}

  async planAccessFilters(
    sessionInfo: GetSessionInfoDto,
    teams: number[] = [],
  ): Promise<Pick<Prisma.IndividualGrowthPlanWhereInput, 'OR'>> {
    if (sessionInfo.role === 'admin') {
      return {};
    }
    const accessTeams =
      await this.usersAccessService.findAllowedTeams(sessionInfo);

    return {
      OR: [
        {
          rate360: {
            team: {
              id: {
                in:
                  teams.length > 0
                    ? teams.filter((t) => accessTeams.includes(t))
                    : accessTeams,
              },
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
        {
          userId: {
            in: await this.usersAccessService.findAllowedSubbordinates(
              sessionInfo.id,
            ),
          },
        },
      ],
    };
  }

  async findOneby360Id(id: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.individualGrowthPlan.findFirst({
      where: {
        id: id,
        ...(sessionInfo.role !== 'admin'
          ? await this.planAccessFilters(sessionInfo)
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
            team: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        user: {
          include: {
            deputyRelationsAsDeputy: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        planCurators: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async create(rateId: number, sessionInfo: GetSessionInfoDto) {
    const rate360 = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        OR: [
          {
            team: {
              id: {
                in: await this.usersAccessService.findAllowedTeams(sessionInfo),
              },
            },
          },
          {
            evaluators: {
              some: {
                userId: sessionInfo.id,
                type: 'CURATOR',
              },
            },
          },
          {
            userId: {
              in: await this.usersAccessService.findAllowedSubbordinates(
                sessionInfo.id,
              ),
            },
          },
        ],
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
        planCurators: {
          createMany: {
            data:
              rate360.evaluators
                ?.filter((u) => u.type === 'CURATOR')
                .map((u) => ({
                  userId: u.userId,
                })) || [],
          },
        },
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

  async updatePlan(
    id: number,
    data: Partial<IndividualGrowthPlan>,
    sessionInfo: GetSessionInfoDto,
  ) {
    const filters = {
      ...(await this.planAccessFilters(sessionInfo)),
      rate360Id: id,
    } as Prisma.IndividualGrowthPlanWhereUniqueInput;

    return this.prismaService.individualGrowthPlan.update({
      where: filters,
      data: data,
    });
  }

  async updateTask(
    id: number,
    data: Partial<GrowthPlanTask>,
    session: GetSessionInfoDto,
  ) {
    const filters = {
      ...(await this.planAccessFilters(session)),
      tasks: {
        some: {
          id: id,
        },
      },
    } as Prisma.IndividualGrowthPlanWhereInput;

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

  async deleteTasks(ids: number[], sessionInfo: GetSessionInfoDto) {
    return this.prismaService.growthPlanTask.deleteMany({
      where: await this.taskMultiupleQuery(ids, sessionInfo),
    });
  }

  async boardChange(
    ids: number[],
    onBoard: boolean,
    sessionInfo: GetSessionInfoDto,
  ) {
    return this.prismaService.growthPlanTask.updateMany({
      where: await this.taskMultiupleQuery(ids, sessionInfo),
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

  async setCurator(id: number, curatorId: number) {
    await this.prismaService.growthPlanCurator.deleteMany({
      where: {
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
          },
        },
      },
    });
  }

  async findAllTasks(userId: number, session: GetSessionInfoDto) {
    const isAllTasksAccess = userId === session.id || session.role === 'admin';

    let result = async () =>
      this.prismaService.growthPlanTask.findMany({
        where: {
          plan: {
            userId,
            archived: false,
            ...(isAllTasksAccess ? {} : await this.planAccessFilters(session)),
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
        planCurators: true,
      },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (
      clientInfo.role !== 'admin' &&
      !(
        (await this.usersAccessService.findAllowedTeams(clientInfo)).includes(
          plan.rate360.team.id,
        ) ||
        plan.planCurators.some((curator) => curator.userId === clientInfo.id) ||
        (
          await this.usersAccessService.findAllowedSubbordinates(clientInfo.id)
        ).some((subordinate) => subordinate === data.userId)
      )
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
        ...(data.addToConstructor && data.competencyId
          ? {
              competencyMaterials: {
                create: { competencyId: data.competencyId },
              },
            }
          : {}),
        ...(data.addToConstructor && data.indicatorId
          ? {
              indicatorMaterials: { create: { indicatorId: data.indicatorId } },
            }
          : {}),
        task: {
          create: {
            status: TaskStatus.TO_DO,
            priority: data.priority,
            type: data.taskType,
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

  findAllFilters(
    { startDate, endDate, user, deputyOnly }: IprFiltersDto,
    sessionInfo: GetSessionInfoDto,
  ): Prisma.IndividualGrowthPlanWhereInput {
    return {
      ...(startDate
        ? {
            startDate: {
              gte: new Date(startDate),
            },
          }
        : {}),
      ...(endDate
        ? {
            endDate: {
              lte: new Date(endDate),
            },
          }
        : {}),
      ...(user ? { userId: user } : {}),
      ...(deputyOnly
        ? {
            user: {
              deputyRelationsAsDeputy: {
                some: {
                  userId: sessionInfo.id,
                },
              },
            },
          }
        : {}),
    };
  }

  async findAllSubbordinates(
    sessionInfo: GetSessionInfoDto,
    params: IprFiltersDto,
  ) {
    const { limit, page, skill, specId } = params;

    const where = this.findAllFilters(params, sessionInfo);

    const allowedSubbordinates =
      await this.usersAccessService.findAllowedSubbordinatesWithTeams(
        sessionInfo.id,
      );

    where.rate360 = {
      ...(specId ? { specId } : {}),
      ...(skill ? { type: skill } : {}),
    };

    where.OR = [
      {
        rate360: {
          OR: allowedSubbordinates.map(({ teamId, userId }) => ({
            userId,
            teamId,
          })),
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

    const [data, total] = await Promise.all([
      this.prismaService.individualGrowthPlan.findMany({
        where,
        include: findAllIprInclude,
        orderBy: {
          id: 'desc',
        },
        ...(Number.isInteger(page) ? { skip: (page - 1) * limit } : {}),
        ...(limit ? { take: limit } : {}),
      }),
      this.prismaService.individualGrowthPlan.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }

  async findAll(sessionInfo: GetSessionInfoDto, params: IprFiltersDto) {
    const { limit, page, skill, specId, teams } = params;
    const teamFilters = teams?.split(',').map((t) => Number(t)) || [];

    const where = this.findAllFilters(params, sessionInfo);

    if (teamFilters.length > 0 || specId || skill) {
      where.rate360 = {
        ...(teamFilters.length > 0
          ? {
              teamId: {
                in: teamFilters,
              },
            }
          : {}),
        ...(specId ? { specId } : {}),
        ...(skill ? { type: skill } : {}),
      };
    }

    if (sessionInfo.role === 'admin') {
      const [data, total] = await Promise.all([
        this.prismaService.individualGrowthPlan.findMany({
          where,
          include: findAllIprInclude,
          orderBy: {
            id: 'desc',
          },
          ...(Number.isInteger(page) ? { skip: (page - 1) * limit } : {}),
          ...(limit ? { take: limit } : {}),
        }),
        this.prismaService.individualGrowthPlan.count({ where }),
      ]);

      return {
        data,
        total,
      };
    }

    where.OR = (await this.planAccessFilters(sessionInfo, teamFilters)).OR;

    if (where.rate360?.teamId) {
      delete where.rate360.teamId;
    }

    const [data, total] = await Promise.all([
      this.prismaService.individualGrowthPlan.findMany({
        where,
        include: findAllIprInclude,
        orderBy: {
          id: 'desc',
        },
        ...(Number.isInteger(page) ? { skip: (page - 1) * limit } : {}),
        ...(limit ? { take: limit } : {}),
      }),
      this.prismaService.individualGrowthPlan.count({
        where,
      }),
    ]);

    return {
      data,
      total,
    };
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
            planCurators: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
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

    if (foundTask.plan.planCurators.some((c) => c.user.id === sessionInfo.id)) {
      return true;
    }

    return false;
  }

  // access checks
  async taskMultiupleQuery(taskIds: number[], sessionInfo: GetSessionInfoDto) {
    return {
      id: {
        in: taskIds,
      },
      ...(sessionInfo.role !== 'admin'
        ? {
            plan: await this.planAccessFilters(sessionInfo),
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
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        planCurators: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    if (!ipr) throw new NotFoundException('Ipr not found');
    return ipr;
  }

  async finduserIprMany(sessionInfo: GetSessionInfoDto, params: IprFiltersDto) {
    const where = {
      userId: sessionInfo.id,
    };

    const [data, total] = await Promise.all([
      await this.prismaService.individualGrowthPlan.findMany({
        where,
        include: {
          tasks: true,
          rate360: {
            include: {
              spec: true,
            },
          },
          planCurators: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
        ...(Number.isInteger(params.page)
          ? { skip: (params.page - 1) * params.limit }
          : {}),
        ...(params.limit ? { take: params.limit } : {}),
      }),
      await this.prismaService.individualGrowthPlan.count({
        where,
      }),
    ]);

    return { data, total };
  }

  async findCompetencyBlocksByIpr(id: number) {
    return await this.prismaService.competencyBlock.findMany({
      where: {
        rates360: {
          some: {
            plan: {
              id: id,
            },
          },
        },
      },
      include: {
        competencies: {
          include: {
            indicators: true,
          },
        },
      },
    });
  }

  async deleteIprs(data: DeleteIprsDto) {
    return await this.prismaService.individualGrowthPlan.deleteMany({
      where: {
        id: {
          in: data.ids,
        },
      },
    });
  }

  async deputyAccessCheck(sessionInfo: GetSessionInfoDto, body: SetDeputyDto) {
    if (sessionInfo.role !== 'admin') {
      if (body.userId !== sessionInfo.id)
        throw new ForbiddenException(
          'Вы не можете назначить заместителя для другого пользователя',
        );
      const user = await this.prismaService.user.findFirst({
        where: {
          id: body.deputyId,
          OR: [
            {
              teams: {
                some: {
                  team: {
                    curatorId: sessionInfo.id,
                  },
                },
              },
            },
            {
              growthPlans: {
                some: {
                  planCurators: {
                    some: {
                      userId: sessionInfo.id,
                    },
                  },
                },
              },
            },
            {
              deputyRelationsAsDeputy: {
                some: {
                  userId: sessionInfo.id,
                },
              },
            },
          ],
        },
      });
      if (!user)
        throw new ForbiddenException(
          'У вас нет прав на установку заместителя для этого пользователя',
        );
    }
  }

  async setDeputy(body: SetDeputyDto, sessionInfo: GetSessionInfoDto) {
    await this.deputyAccessCheck(sessionInfo, body);
    const deputy = await this.prismaService.userDeputy.create({
      data: {
        userId: body.userId,
        deputyId: body.deputyId,
      },
      select: {
        deputy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    return deputy;
  }

  async removeDeputy(body: SetDeputyDto, sessionInfo: GetSessionInfoDto) {
    await this.deputyAccessCheck(sessionInfo, body);
    await this.prismaService.userDeputy.delete({
      where: {
        userId_deputyId: {
          userId: body.userId,
          deputyId: body.deputyId,
        },
      },
    });
    return HttpStatus.OK;
  }
}
