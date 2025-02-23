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

@Injectable()
export class Rate360Service {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const rates = await this.prismaService.rate360.findMany({
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
          },
        },
        spec: {
          select: {
            id: true,
          },
        },
        team: {
          select: {
            id: true,
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
        plan: true,
      },
    });
    return rates;
  }

  async deleteRate(id: number) {
    return await this.prismaService.rate360.delete({
      where: { id },
    });
  }

  async createRate(data: CreateRateDto) {
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

    const createdRates = await this.prismaService.rate360.createManyAndReturn({
      data: ratesToCreate.map((rate) => ({
        type: rate.type,
        specId: rate.specId,
        userId: rate.userId,
        teamId: rate.teamId,
        userConfirmed: !confirmUser,
        curatorConfirmed: !confirmCurator,
      })),
    });

    return await Promise.all(
      ratesToCreate.map(async (rate, index) => {
        return await this.prismaService.rate360.update({
          where: { id: createdRates[index].id },
          data: {
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
          },
        });
      }),
    );
  }

  async findAssignedRates(userId: number) {
    return await this.prismaService.rate360.findMany({
      where: {
        evaluators: {
          some: {
            userId,
          },
        },
        OR: [
          {
            userRates: {
              some: {
                approved: false,
                userId,
              },
            },
          },
          {
            userRates: {
              none: {
                userId,
              },
            },
          },
        ],
        curatorConfirmed: true,
        userConfirmed: true,
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
      },
    });
  }

  async findSelfRates(userId: number) {
    return await this.prismaService.rate360.findMany({
      where: {
        userId,
        OR: [
          {
            userRates: {
              some: {
                approved: false,
              },
            },
          },
          {
            userRates: {
              none: {
                userId,
              },
            },
          },
        ],
        userConfirmed: true,
        curatorConfirmed: true,
      },
      include: {
        spec: true,
        userRates: {
          where: {
            userId,
          },
        },
      },
    });
  }

  async findForUser(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        OR: [
          {
            userRates: {
              some: {
                userId,
                approved: false,
              },
            },
          },
          {
            userRates: {
              none: {
                userId,
              },
            },
          },
        ],
        userConfirmed: true,
        curatorConfirmed: true,
      },
      include: {
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
    return rate;
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
      },
      include: {
        userRates: {
          where: {
            userId,
          },
        },
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
      },
    });

    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }

    const indicators = rate.spec.competencyBlocks.flatMap((block) =>
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
      },
      include: {
        userRates: {
          where: {
            userId,
          },
        },
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
      },
    });

    if (!rate) {
      throw new NotFoundException('Оценка не найдена');
    }

    const indicators = rate.spec.competencyBlocks.flatMap((block) =>
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
      },
      data: {
        curatorConfirmed: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Rate not found');
    }
    return data;
  }

  async confirmRateUser(userId: number, rateId: number) {
    const data = await this.prismaService.rate360.update({
      where: {
        userId,
        id: rateId,
      },
      data: {
        userConfirmed: true,
      },
    });
    if (!data) {
      throw new NotFoundException('Rate not found');
    }
    return data;
  }

  async findRatesToConfirmByUser(userId: number) {
    return await this.prismaService.rate360.findMany({
      where: {
        userId,
        userConfirmed: false,
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
  }

  async confirmByUser(
    { evaluateSubbordinate, evaluateTeam, rateId, comment }: ConfirmRateDto,
    userId: number,
  ) {
    console.log(comment);
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
  }
}
