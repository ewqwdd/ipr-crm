import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { EvaluatorType } from '@prisma/client';
import { RatingsDto } from './dto/user-assesment.dto';
import { ConfirmRateDto } from './dto/confirm-rate.dto';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { ToggleReportVisibilityDto } from './dto/toggle-report-visibility.dto';
import { SingleRateIdDto } from './dto/single-rate-id.dto';
import { SingleCommentDto } from './dto/single-comment.dto';
import { DeleteEvaluatorsDto } from './dto/delete-evaluators.dto';
import { AddEvaluatorsDto } from './dto/add-evalators.dto';
import { RateFiltersDto } from './dto/rate-filters.dto';
import { UsersAccessService } from 'src/users/users-access.service';

@Injectable()
export class Rate360Service {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
    private usersService: UsersAccessService,
  ) {}

  accessCheck(sessionInfo: GetSessionInfoDto) {
    return sessionInfo.role !== 'admin'
      ? {
          team: {
            curatorId: sessionInfo.id,
          },
        }
      : {};
  }

  async accessCheckWithSubTeams(sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role === 'admin') {
      return {};
    }
    const allowedTeamIds = await this.usersService.findAllowedTeams(
      sessionInfo.id,
    );

    return {
      team: {
        id: { in: allowedTeamIds },
      },
    };
  }

  async findAll(
    {
      limit,
      page,
      endDate,
      skill,
      specId,
      startDate,
      status,
      teams: teams_,
      user,
    }: RateFiltersDto,
    curatorId?: number,
  ) {
    const teams = teams_ ? teams_.split(',').map(Number) : [];
    let teamsFilter: number[] = teams ?? [];

    if (curatorId) {
      teamsFilter = await this.usersService.findAllowedTeams(curatorId);
      if (teams) {
        teamsFilter =
          teams.length > 0
            ? teams.filter((team) => teamsFilter.includes(team))
            : teamsFilter;
      }
    }

    const where = {
      archived: false,
      ...(curatorId || teams.length > 0
        ? { team: { id: { in: teamsFilter } } }
        : {}),
      ...(user ? { userId: user } : {}),
      ...(specId ? { specId } : {}),
      ...(skill ? { type: skill } : {}),
      ...(status === 'COMPLETED'
        ? { finished: true }
        : status === 'NOT_COMPLETED'
          ? { finished: false }
          : {}),
      ...(startDate ? { startDate: { gte: new Date(startDate) } } : {}),
      ...(endDate ? { endDate: { lte: new Date(endDate) } } : {}),
    };

    const [total, rates] = await this.prismaService.$transaction([
      this.prismaService.rate360.count({ where }),
      this.prismaService.rate360.findMany({
        where,
        include: {
          evaluators: {
            select: {
              userId: true,
              type: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          spec: {
            select: {
              id: true,
              name: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            select: {
              comment: true,
              competencyId: true,
              userId: true,
            },
          },
          userRates: {
            include: {
              indicator: true,
            },
            where: {
              approved: true,
            },
          },
          competencyBlocks: {
            include: {
              competencies: {
                include: {
                  indicators: true,
                },
              },
            },
          },
          plan: true,
        },
        ...(Number.isInteger(page) ? { skip: (page - 1) * limit } : {}),
        ...(limit ? { take: limit } : {}),
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: rates,
    };
  }

  async deleteRate(id: number) {
    return await this.prismaService.rate360.delete({
      where: { id },
    });
  }

  async createRate(data: CreateRateDto, sessionInfo: GetSessionInfoDto) {
    const { rate, skill, confirmCurator, confirmUser } = data;
    return await this.prismaService.$transaction(async (tx) => {
      const ratesToCreate = skill.flatMap((skill) =>
        rate.flatMap((team) => {
          return team.specs.map((spec) => ({
            teamId: team.teamId,
            type: skill,
            ...spec,
          }));
        }),
      );

      if (sessionInfo.role !== 'admin') {
        const curatorTeams = await tx.team.findMany({
          where: {
            curatorId: sessionInfo.id,
          },
          select: {
            id: true,
            name: true,
            subTeams: {
              select: {
                id: true,
                name: true,
                subTeams: {
                  select: {
                    id: true,
                    name: true,
                    subTeams: {
                      select: {
                        id: true,
                        name: true,
                        subTeams: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const allTeams = this.usersService.findSubTeams(curatorTeams);
        const allowedTeamIds = allTeams.map((team) => team.id);

        const rateTeamIds = ratesToCreate.map((rate) => rate.teamId);
        const found = rateTeamIds.some(
          (teamId) => !allowedTeamIds.includes(teamId),
        );
        if (found) {
          throw new ForbiddenException(
            'You are not allowed to create this rate',
          );
        }
      }

      const competencyBlocks = await tx.competencyBlock.findMany({
        where: {
          specs: {
            some: {
              id: { in: ratesToCreate.map((rate) => rate.specId) },
            },
          },
          type: {
            in: skill,
          },
          archived: false,
        },
        select: {
          id: true,
          specs: {
            select: { id: true },
          },
          type: true,
        },
      });

      const createdRates = await tx.rate360.createManyAndReturn({
        data: ratesToCreate.map((rate) => ({
          type: rate.type,
          specId: rate.specId,
          userId: rate.userId,
          teamId: rate.teamId,
          userConfirmed: !confirmUser,
          curatorConfirmed: !confirmCurator,
          rateType: data.rateType,
        })),
      });

      return await Promise.all(
        ratesToCreate.map(async (rate, index) => {
          const team = await tx.team.findUnique({
            where: {
              id: rate.teamId,
            },
            select: {
              curatorId: true,
              parentTeamId: true,
              parentTeam: {
                include: {
                  curator: true,
                },
              },
            },
          });

          let curatorConfirm = data.confirmCurator;

          if (team.curatorId === rate.userId && !team.parentTeamId) {
            curatorConfirm = false;
          }

          if (data.confirmUser) {
            await this.notificationsService.sendRateConfirmNotification(
              rate.userId,
              createdRates[index].id,
              tx,
            );
          } else if (curatorConfirm) {
            if (team.curatorId === rate.userId) {
              await this.notificationsService.sendRateConfirmNotification(
                team.parentTeam.curator.id,
                createdRates[index].id,
                tx,
              );
            } else {
              await this.notificationsService.sendRateConfirmNotification(
                team.curatorId,
                createdRates[index].id,
                tx,
              );
            }
          } else {
            await this.notificationsService.sendRateAssignedNotification(
              rate.userId,
              createdRates[index].id,
              tx,
            );
            for (const evaluator of [
              ...rate.evaluateCurators,
              ...rate.evaluateSubbordinate,
              ...rate.evaluateTeam,
            ]) {
              await this.notificationsService.sendRateAssignedNotification(
                evaluator.userId,
                createdRates[index].id,
                tx,
              );
            }
          }
          return await tx.rate360.update({
            where: { id: createdRates[index].id },
            data: {
              curatorConfirmed: !curatorConfirm,
              evaluators: {
                createMany: {
                  data: [
                    ...rate.evaluateCurators.map((evaluator) => ({
                      userId: evaluator.userId,
                      type: EvaluatorType.CURATOR,
                    })),
                    ...rate.evaluateTeam.map((evaluator) => ({
                      userId: evaluator.userId,
                      type: EvaluatorType.TEAM_MEMBER,
                    })),
                    ...rate.evaluateSubbordinate.map((evaluator) => ({
                      userId: evaluator.userId,
                      type: EvaluatorType.SUBORDINATE,
                    })),
                  ],
                },
              },
              competencyBlocks: {
                connect: competencyBlocks
                  .filter(
                    (block) =>
                      block.specs.find((s) => s.id === rate.specId) &&
                      rate.type === block.type,
                  )
                  .map(({ id }) => ({ id })),
              },
            },
          });
        }),
      );
    });
  }

  async findAssignedRates(userId: number) {
    const rate360 = await this.prismaService.rate360.findMany({
      where: {
        finished: false,
        evaluators: {
          some: {
            userId,
          },
        },
        curatorConfirmed: true,
        userConfirmed: true,
        archived: false,
      },
      include: {
        spec: true,
        userRates: {
          where: {
            userId,
          },
        },
        evaluators: {
          where: {
            userId,
          },
        },
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
      },
    });

    const filtered = rate360.filter((rate) => {
      const indicators = rate.competencyBlocks
        .filter((c) => c.type === rate.type)
        .flatMap((block) =>
          block.competencies.flatMap((competency) => competency.indicators),
        );
      const userRates = rate.userRates.filter(
        (rate) => rate.userId === userId && rate.approved,
      );
      return userRates.length < indicators.length;
    });
    return filtered;
  }

  async findSelfRates(userId: number) {
    const rate360 = await this.prismaService.rate360.findMany({
      where: {
        finished: false,
        userId,
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
      },
      include: {
        spec: true,
        userRates: {
          where: {
            userId,
          },
        },
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
      },
    });
    const filtered = rate360.filter((rate) => {
      const indicators = rate.competencyBlocks
        .filter((c) => c.type === rate.type)
        .flatMap((block) =>
          block.competencies.flatMap((competency) => competency.indicators),
        );
      const userRates = rate.userRates.filter(
        (rate) => rate.userId === userId && rate.approved,
      );
      return userRates.length < indicators.length;
    });
    return filtered;
  }

  async findForUser(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        finished: false,
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
      },
      include: {
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
        spec: true,
        userRates: {
          where: {
            userId,
          },
        },
        team: true,
        evaluators: {
          where: {
            userId,
          },
        },
        comments: {
          where: {
            userId,
          },
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }
    if (
      rate.userId !== userId &&
      !rate.evaluators.some((evaluator) => evaluator.userId === userId)
    ) {
      throw new NotFoundException('Rate not found');
    }
    const indicators = rate.competencyBlocks.flatMap((block) =>
      block.competencies.flatMap((competency) => competency.indicators),
    );
    const userRates = rate.userRates.filter(
      (rate) => rate.userId === userId && rate.approved,
    );
    if (userRates.length < indicators.length) {
      return rate;
    } else {
      throw new ForbiddenException('Rate already approved');
    }
  }

  async singleAssessment(userId: number, data: SingleRateIdDto) {
    const { rate, indicatorId, rateId } = data;
    const found = await this.findForUser(userId, rateId);
    if (!found) {
      throw new NotFoundException('Rate not found');
    }

    const indicatorRate = await this.prismaService.userRates.findFirst({
      where: {
        userId,
        rate360Id: rateId,
        indicatorId,
      },
    });

    if (indicatorRate) {
      await this.prismaService.userRates.update({
        where: {
          id: indicatorRate.id,
        },
        data: {
          rate,
        },
      });
    } else {
      await this.prismaService.userRates.create({
        data: {
          userId,
          rate360Id: rateId,
          indicatorId,
          rate,
        },
      });
    }
  }

  async userAssessment(
    userId: number,
    { rateId, ratings, comments }: RatingsDto,
  ) {
    const found = await this.findForUser(userId, rateId);
    if (!found) {
      throw new NotFoundException('Rate not found');
    }

    const indicatorIds = Object.keys(ratings).map((id) => Number(id));
    const newRatings = Object.entries(ratings)
      .filter(([, v]) => !!v.rate)
      .map(([indicatorId, { rate, comment }]) => ({
        userId,
        rate,
        indicatorId: Number(indicatorId),
        comment,
      }));

    await this.prismaService.$transaction([
      this.prismaService.userRates.deleteMany({
        where: {
          userId,
          rate360Id: rateId,
          indicatorId: { in: indicatorIds },
        },
      }),
      this.prismaService.rate360.update({
        where: { id: rateId },
        data: {
          userRates: {
            create: newRatings,
          },
        },
      }),
      this.prismaService.userComments.deleteMany({
        where: { rate360Id: rateId, userId: userId },
      }),
      this.prismaService.rate360.update({
        where: { id: rateId },
        data: {
          comments: {
            create: Object.entries(comments).map(([competencyId, comment]) => ({
              competencyId: Number(competencyId),
              comment,
              userId,
            })),
          },
        },
      }),
    ]);
  }

  async singleComment(userId: number, data: SingleCommentDto) {
    const found = await this.findForUser(userId, data.rateId);
    if (!found) {
      throw new NotFoundException('Rate not found');
    }

    const comment = await this.prismaService.userComments.findFirst({
      where: {
        userId,
        rate360Id: data.rateId,
        competencyId: data.competencyId,
      },
    });
    if (comment) {
      await this.prismaService.userComments.update({
        where: {
          id: comment.id,
        },
        data: {
          comment: data.comment,
        },
      });
    } else {
      await this.prismaService.userComments.create({
        data: {
          userId,
          rate360Id: data.rateId,
          competencyId: data.competencyId,
          comment: data.comment,
        },
      });
    }
    return HttpStatus.OK;
  }

  async checkIfFinished(rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        archived: false,
      },
      include: {
        userRates: {
          where: {
            approved: true,
          },
        },
        evaluators: true,
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
      },
    });

    if (!rate) return;

    const indicators = rate.competencyBlocks
      .filter((e) => e.type === rate.type)
      .flatMap((block) =>
        block.competencies.flatMap((competency) => competency.indicators),
      );

    const rateCount = rate.userRates.length;
    const requiredCount = indicators.length * (rate.evaluators.length + 1);

    if (rateCount >= requiredCount) {
      await this.prismaService.rate360.update({
        where: {
          id: rateId,
        },
        data: {
          finished: true,
        },
      });
    }
  }

  async approveSelfRate(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        userId,
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
      },
      include: {
        userRates: {
          where: {
            userId,
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
      },
    });

    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }

    const indicators = rate.competencyBlocks
      .filter((e) => e.type === rate.type)
      .flatMap((block) =>
        block.competencies.flatMap((competency) => competency.indicators),
      );
    const userRates = rate.userRates;
    if (userRates.length < indicators.length) {
      throw new ForbiddenException('Оценка не завершена');
    }

    await this.prismaService.userRates.updateMany({
      where: {
        rate360Id: rateId,
        userId,
      },
      data: {
        approved: true,
      },
    });
    await this.checkIfFinished(rateId);
    return HttpStatus.OK;
  }

  async approveAssignedRate(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        evaluators: {
          some: {
            userId,
          },
        },
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
      },
      include: {
        userRates: {
          where: {
            userId,
          },
        },
        spec: true,
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
      },
    });

    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }

    const indicators = rate.competencyBlocks
      .filter((e) => e.type === rate.type)
      .flatMap((block) =>
        block.competencies.flatMap((competency) => competency.indicators),
      );
    console.log(indicators.length, rate.userRates.length);
    const userRates = rate.userRates;
    if (userRates.length < indicators.length) {
      throw new ForbiddenException('Оценка не завершена');
    }

    await this.prismaService.userRates.updateMany({
      where: {
        rate360Id: rateId,
        userId,
      },
      data: {
        approved: true,
      },
    });

    await this.checkIfFinished(rateId);
    return;
  }

  async report(rateId: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        archived: false,
        ...(sessionInfo.role !== 'admin'
          ? {
              OR: [
                {
                  userId: sessionInfo.id,
                  userConfirmed: true,
                  curatorConfirmed: true,
                  showReportToUser: true,
                },
                {
                  ...(await this.accessCheckWithSubTeams(sessionInfo)),
                },
              ],
            }
          : {}),
      },
      include: {
        evaluators: {
          select: {
            userId: true,
            type: true,
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                id: true,
              },
            },
          },
        },
        user: {
          include: {
            teams: {
              include: {
                team: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
        spec: {
          select: {
            id: true,
            name: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          select: {
            comment: true,
            competencyId: true,
            userId: true,
          },
        },
        userRates: {
          include: {
            indicator: true,
          },
          where: {
            approved: true,
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
        plan: true,
      },
    });
  }

  async confirmRateCurator(userId: number, rateId: number) {
    const data = await this.prismaService.rate360.update({
      where: {
        team: {
          curatorId: userId,
        },
        id: rateId,
        archived: false,
      },
      data: {
        curatorConfirmed: true,
      },
      include: {
        evaluators: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Rate not found');
    }
    await this.notificationsService.sendRateSelfAssignedNotification(
      data.userId,
      rateId,
    );
    for (const evaluator of data.evaluators) {
      await this.notificationsService.sendRateAssignedNotification(
        evaluator.userId,
        rateId,
      );
    }
    return data;
  }

  async confirmRateUser(userId: number, rateId: number) {
    const data = await this.prismaService.rate360.update({
      where: {
        userId,
        id: rateId,
        archived: false,
      },
      data: {
        userConfirmed: true,
      },
      include: {
        team: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Rate not found');
    }
    if (data.team && !data.curatorConfirmed) {
      await this.notificationsService.sendRateConfirmNotification(
        data.team.curatorId,
        rateId,
      );
    }
    return data;
  }

  async findRatesToConfirmByUser(userId: number) {
    return await this.prismaService.rate360.findMany({
      where: {
        userId,
        userConfirmed: false,
        archived: false,
      },
      include: {
        spec: true,
        user: {
          select: {
            username: true,
          },
        },
        evaluators: {
          select: {
            type: true,
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findRatesToConfirmByCurator(userId: number) {
    const rates = await this.prismaService.rate360.findMany({
      where: {
        team: {
          OR: [
            {
              curatorId: userId,
            },
            {
              parentTeam: {
                curatorId: userId,
              },
            },
          ],
        },
        curatorConfirmed: false,
        userConfirmed: true,
        archived: false,
      },
      include: {
        spec: true,
        user: {
          select: {
            username: true,
          },
        },
        competencyBlocks: {
          include: {
            competencies: {
              include: {
                indicators: true,
              },
            },
          },
        },
        evaluators: {
          select: {
            type: true,
            userId: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        team: {
          select: {
            name: true,
            curatorId: true,
            parentTeam: {
              select: {
                curatorId: true,
              },
            },
          },
        },
      },
    });

    // Для куратора оценки челнов его команды или куратора дочерней команды

    const filtered = rates.filter((rate) => {
      if (rate.team.curatorId !== rate.userId && rate.team.curatorId === userId)
        return true;
      if (rate.team.parentTeam && rate.team.parentTeam.curatorId === userId)
        return true;
      return false;
    });
    return filtered;
  }

  async confirmByCurator(
    {
      evaluateCurators,
      evaluateSubbordinate,
      evaluateTeam,
      rateId,
      comment,
    }: ConfirmRateDto,
    curatorId: number,
  ) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        team: {
          OR: [
            {
              curatorId,
            },
            {
              parentTeam: {
                curatorId,
              },
            },
          ],
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    const evaluatorsData = [
      ...evaluateCurators.map((e) => ({
        userId: e.userId,
        type: EvaluatorType.CURATOR,
      })),
      ...evaluateSubbordinate.map((e) => ({
        userId: e.userId,
        type: EvaluatorType.SUBORDINATE,
      })),
      ...evaluateTeam.map((e) => ({
        userId: e.userId,
        type: EvaluatorType.TEAM_MEMBER,
      })),
    ];

    await this.prismaService.$transaction([
      this.prismaService.rate360Evaluator.deleteMany({
        where: {
          rate360Id: rateId,
        },
      }),
      this.prismaService.rate360.update({
        where: {
          id: rateId,
        },
        data: {
          evaluators: {
            createMany: {
              data: evaluatorsData,
            },
          },
          curatorComment: comment,
          curatorConfirmed: true,
        },
      }),
    ]);

    this.sendNotificationStatus(rateId);
    return;
  }

  async confirmByUser(
    { evaluateSubbordinate, evaluateTeam, rateId, comment }: ConfirmRateDto,
    userId: number,
  ) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        userId,
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    const evaluatorsData = [
      ...evaluateSubbordinate.map((e) => ({
        userId: e.userId,
        type: EvaluatorType.SUBORDINATE,
      })),
      ...evaluateTeam.map((e) => ({
        userId: e.userId,
        type: EvaluatorType.TEAM_MEMBER,
      })),
    ];

    await this.prismaService.$transaction([
      this.prismaService.rate360Evaluator.deleteMany({
        where: {
          rate360Id: rateId,
          type: {
            not: EvaluatorType.CURATOR,
          },
        },
      }),
      this.prismaService.rate360.update({
        where: {
          id: rateId,
        },
        data: {
          evaluators: {
            createMany: {
              data: evaluatorsData,
            },
          },
          userComment: comment,
          userConfirmed: true,
        },
      }),
    ]);

    this.sendNotificationStatus(rateId);
    return;
  }

  async deleteRates(ids: number[]) {
    await this.prismaService.rate360.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        archived: true,
      },
    });
    await this.prismaService.notification.updateMany({
      where: {
        rateId: {
          in: ids,
        },
      },
      data: {
        watched: true,
      },
    });
  }

  async notifyRates(ids: number[]) {
    const promises = ids.map((id) => this.sendNotificationStatus(id));
    await Promise.all(promises);
    return HttpStatus.OK;
  }

  async sendNotificationStatus(rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
      },
      include: {
        team: true,
        user: true,
        evaluators: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    if (!rate.userConfirmed) {
      await this.notificationsService.sendRateSelfAssignedNotification(
        rate.userId,
        rateId,
      );
    } else if (!rate.curatorConfirmed) {
      await this.notificationsService.sendRateConfirmNotification(
        rate.team.curatorId,
        rateId,
      );
    } else {
      await this.notificationsService.sendRateAssignedNotification(
        rate.userId,
        rate.id,
      );
      for (const evaluator of rate.evaluators) {
        await this.notificationsService.sendRateAssignedNotification(
          evaluator.userId,
          rate.id,
        );
      }
    }
  }

  async findMyRates(userId: number, params: RateFiltersDto) {
    const where = {
      userId,
      archived: false,
    };
    const [data, total] = await Promise.all([
      this.prismaService.rate360.findMany({
        where,
        include: {
          spec: true,
          userRates: {
            where: {
              approved: true,
            },
            select: {
              user: {
                select: {
                  username: true,
                  id: true,
                },
              },
            },
          },
          team: true,
          competencyBlocks: {
            include: {
              competencies: {
                include: {
                  indicators: true,
                },
              },
            },
          },
          evaluators: {
            select: {
              id: true,
            },
          },
        },
        ...(Number.isInteger(params.page)
          ? { skip: (params.page - 1) * params.limit }
          : {}),
        ...(params.limit ? { take: params.limit } : {}),
      }),
      this.prismaService.rate360.count({
        where,
      }),
    ]);

    return { data, total };
  }

  async toggleReportVisibility(
    data: ToggleReportVisibilityDto,
    sessionInfo: GetSessionInfoDto,
  ) {
    return await this.prismaService.rate360.updateMany({
      where: {
        id: {
          in: data.ids,
        },
        ...this.accessCheck(sessionInfo),
      },
      data: {
        showReportToUser: !!data.isVisible,
      },
    });
  }

  async deleteEvaluators(id: number, data: DeleteEvaluatorsDto) {
    const promises = [
      this.prismaService.rate360Evaluator.deleteMany({
        where: {
          rate360Id: id,
          userId: {
            in: data.ids,
          },
        },
      }),
      this.prismaService.notification.deleteMany({
        where: {
          rateId: id,
          userId: {
            in: data.ids,
          },
        },
      }),
      this.prismaService.userRates.deleteMany({
        where: {
          rate360Id: id,
          userId: {
            in: data.ids,
          },
        },
      }),
    ];
    const result = await Promise.all(promises);
    return result[0];
  }

  async setEvaluators(id: number, data: AddEvaluatorsDto) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id,
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    const evaluators = await this.prismaService.rate360Evaluator.findMany({
      where: {
        rate360Id: id,
      },
    });

    const allIds = [
      ...data.evaluateCurators,
      ...data.evaluateSubbordinate,
      ...data.evaluateTeam,
    ];

    const evaluatorsIds = evaluators.map((evaluator) => evaluator.userId);
    const evaluatorsToAdd = allIds.filter((id) => !evaluatorsIds.includes(id));
    const evaluatorsToDelete = evaluatorsIds.filter(
      (id) => !allIds.includes(id),
    );

    // deletion of evaluators
    await this.prismaService.$transaction([
      this.prismaService.rate360Evaluator.deleteMany({
        where: {
          rate360Id: id,
          userId: {
            in: evaluatorsToDelete,
          },
        },
      }),
      this.prismaService.notification.deleteMany({
        where: {
          rateId: id,
          userId: {
            in: evaluatorsToDelete,
          },
        },
      }),
      this.prismaService.userRates.deleteMany({
        where: {
          rate360Id: id,
          userId: {
            in: evaluatorsToDelete,
          },
        },
      }),
    ]);

    const newEvaluators = await this.prismaService.rate360Evaluator.createMany({
      data: [
        ...data.evaluateCurators
          .filter((id) => evaluatorsToAdd.includes(id))
          .map((evaluator) => ({
            userId: evaluator,
            type: EvaluatorType.CURATOR,
            rate360Id: id,
          })),
        ...data.evaluateSubbordinate
          .filter((id) => evaluatorsToAdd.includes(id))
          .map((evaluator) => ({
            userId: evaluator,
            type: EvaluatorType.SUBORDINATE,
            rate360Id: id,
          })),
        ...data.evaluateTeam
          .filter((id) => evaluatorsToAdd.includes(id))
          .map((evaluator) => ({
            userId: evaluator,
            type: EvaluatorType.TEAM_MEMBER,
            rate360Id: id,
          })),
      ],
    });

    if (rate.curatorConfirmed && rate.userConfirmed) {
      evaluatorsToAdd.forEach(async (id) => {
        await this.notificationsService.sendRateAssignedNotification(
          id,
          rate.id,
        );
      });
    }

    return newEvaluators;
  }

  async leaveAssignedRate(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
      },
      include: {
        evaluators: {
          where: {
            userId,
          },
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }
    if (rate.userId === userId) {
      throw new ForbiddenException('Вы не можете покинуть свою оценку');
    }
    await this.prismaService.rate360Evaluator.deleteMany({
      where: {
        rate360Id: rateId,
        userId,
      },
    });
    await this.prismaService.userRates.deleteMany({
      where: {
        rate360Id: rateId,
        userId,
      },
    });
    return HttpStatus.OK;
  }
}
