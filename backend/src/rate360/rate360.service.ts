import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { EvaluatorType } from '@prisma/client';
import { RatingsDto } from './dto/user-assesment.dto';

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
        userRates: {
          include: {
            indicator: true,
          },
          where: {
            approved: true,
          },
        },
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
    const { rate, skill } = data;
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

  async userAssessment(userId: number, { rateId, ratings }: RatingsDto) {
    const found = await this.findForUser(userId, rateId);
    if (!found) {
      throw new NotFoundException('Rate not found');
    }

    const indicatorIds = Object.keys(ratings).map((id) => Number(id));
    const newRatings = Object.entries(ratings).map(
      ([indicatorId, { rate, comment }]) => ({
        userId,
        rate,
        indicatorId: Number(indicatorId),
        comment,
      }),
    );

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
    ]);
  }

  async approveSelfRate(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
        userId,
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
    if (userRates.length !== indicators.length) {
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
    if (userRates.length !== indicators.length) {
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
}
