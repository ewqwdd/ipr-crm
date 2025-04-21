import {
  ForbiddenException,
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

@Injectable()
export class Rate360Service {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(curatorId?: number) {
    const rates = await this.prismaService.rate360.findMany({
      where: {
        archived: false,
        ...(curatorId
          ? {
              teamId: { not: null }, // защита от null team
              team: {
                curatorId,
              },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rates;
  }

  async deleteRate(id: number) {
    return await this.prismaService.rate360.delete({
      where: { id },
    });
  }

  async createRate(data: CreateRateDto, sessionInfo: GetSessionInfoDto) {
    const { rate, skill, confirmCurator, confirmUser } = data;

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
      const curatorTeams = await this.prismaService.team.findMany({
        where: {
          curatorId: sessionInfo.id,
        },
        select: {
          id: true,
        },
      });

      const rateTeamIds = ratesToCreate.map((rate) => rate.teamId);
      const teamIds = curatorTeams.map((team) => team.id);
      const found = rateTeamIds.some((teamId) => !teamIds.includes(teamId));
      if (found) {
        throw new ForbiddenException('You are not allowed to create this rate');
      }
    }

    const competencyBlocks = await this.prismaService.competencyBlock.findMany({
      where: {
        specId: {
          in: ratesToCreate.map((rate) => rate.specId),
        },
        type: {
          in: skill,
        },
        archived: false,
      },
      select: { id: true, specId: true, type: true },
    });

    const createdRates = await this.prismaService.rate360.createManyAndReturn({
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
        const team = await this.prismaService.team.findUnique({
          where: {
            id: rate.teamId,
          },
          select: {
            curatorId: true,
          },
        });

        let curatorConfirm = data.confirmCurator;

        if (team.curatorId === rate.userId) {
          curatorConfirm = false;
        }

        if (data.confirmUser) {
          await this.notificationsService.sendRateConfirmNotification(
            rate.userId,
            createdRates[index].id,
          );
        } else if (curatorConfirm) {
          await this.notificationsService.sendRateConfirmNotification(
            team.curatorId,
            createdRates[index].id,
          );
        } else {
          await this.notificationsService.sendRateAssignedNotification(
            rate.userId,
            createdRates[index].id,
          );
          for (const evaluator of [
            ...rate.evaluateCurators,
            ...rate.evaluateSubbordinate,
            ...rate.evaluateTeam,
          ]) {
            await this.notificationsService.sendRateAssignedNotification(
              evaluator.userId,
              createdRates[index].id,
            );
          }
        }
        return await this.prismaService.rate360.update({
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
                    block.specId === rate.specId && rate.type === block.type,
                )
                .map(({ id }) => ({ id })),
            },
          },
        });
      }),
    );
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
    return;
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
    return;
  }

  async report(rateId: number) {
    return await this.prismaService.rate360.findFirst({
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
                    indicators: true,
                  },
                },
              },
            },
          },
        },

        evaluators: {
          select: {
            type: true,
            userId: true,
          },
        },
        userRates: {},
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
    return await this.prismaService.rate360.findMany({
      where: {
        team: {
          curatorId: userId,
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
          },
        },
      },
    });
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
          curatorId,
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

  async findMyRates(userId: number) {
    const rates = await this.prismaService.rate360.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        spec: true,
        userRates: {
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
      },
    });

    return rates;
  }
}
