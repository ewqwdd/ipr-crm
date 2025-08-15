import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EvaluatorType, Prisma } from '@prisma/client';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { UsersAccessService } from 'src/users/users-access.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { RateFiltersDto } from './dto/rate-filters.dto';
import { RateTeamFiltersType } from 'src/rate360/constants';

@Injectable()
export class AssesmentService {
  constructor(
    private prismaService: PrismaService,
    private usersAccessService: UsersAccessService,
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

  async accessCheckWithSubTeams(
    sessionInfo: GetSessionInfoDto,
  ): Promise<Prisma.Rate360FindManyArgs['where'][]> {
    if (sessionInfo.role === 'admin') {
      return [{}];
    }
    const allowedTeamIds =
      await this.usersAccessService.findAllowedTeams(sessionInfo);
    const allowedUsers = await this.usersAccessService.findAllowedSubbordinates(
      sessionInfo.id,
    );

    return [
      {
        team: {
          id: { in: allowedTeamIds },
        },
      },
      {
        userId: {
          in: allowedUsers,
        },
      },
      {
        evaluators: {
          some: {
            userId: sessionInfo.id,
            type: EvaluatorType.CURATOR,
          },
        },
      },
    ];
  }

  buildTeamFilters(
    product?: string,
    department?: string,
    direction?: string,
    group?: string,
  ): { OR: RateTeamFiltersType[] } | undefined {
    const getTeamFilters = (names: string[]) => {
      if (names.length === 0) return null;
      return {
        parentTeam: {
          name: names[0],
          ...getTeamFilters(names.slice(1)),
        },
      };
    };

    const teamFilters = [group, direction, department, product];
    const firstNotNull = teamFilters.findIndex(Boolean);
    const sliced = teamFilters.slice(firstNotNull);

    return sliced.length > 0 && firstNotNull !== -1
      ? {
          OR: new Array(firstNotNull + 1).fill(null).map((_, i) => {
            return {
              name: teamFilters[i],
              ...getTeamFilters(teamFilters.slice(i + 1)),
            };
          }),
        }
      : undefined;
  }

  findAllFilters(
    {
      endDate,
      skill,
      specId,
      startDate,
      status,
      user,
      hidden,
      curatorId,
      department,
      direction,
      group,
      product,
    }: RateFiltersDto,
    type: '360' | 'cases',
  ): Prisma.Rate360FindManyArgs['where'] {
    return {
      archived: false,
      ...(user ? { userId: user } : {}),
      ...(specId ? { specId } : {}),
      ...(skill ? { type: skill } : {}),
      ...(status === 'COMPLETED' ? { finished: true } : {}),
      ...(status === 'NOT_COMPLETED' ? { finished: false } : {}),
      ...(status === 'NOT_CONFIRMED'
        ? { userConfirmed: false, curatorConfirmed: false }
        : {}),
      ...(status === 'CONFIRMED'
        ? { userConfirmed: true, curatorConfirmed: true }
        : {}),
      ...(status === 'CONFIRMED_BY_USER'
        ? { userConfirmed: true, curatorConfirmed: false }
        : {}),
      rateType: {
        in: type === '360' ? ['Rate180', 'Rate360'] : ['Case'],
      },
      ...(endDate && startDate
        ? {
            AND: [
              {
                startDate: {
                  gte: new Date(startDate),
                },
              },
              {
                startDate: {
                  lte: new Date(endDate),
                },
              },
            ],
          }
        : {}),
      ...(endDate && !startDate
        ? { startDate: { lte: new Date(endDate) } }
        : {}),
      ...(!endDate && startDate
        ? { startDate: { gte: new Date(startDate) } }
        : {}),
      ...(curatorId
        ? { evaluators: { some: { userId: curatorId, type: 'CURATOR' } } }
        : {}),
      hidden: !!hidden,
      team: this.buildTeamFilters(product, department, direction, group),
    };
  }

  async findForUser(userId: number, rateId: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id: rateId,
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
        cases: {
          include: {
            variants: true,
          },
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }
    const isEvalutor = rate.evaluators.some(
      (evaluator) => evaluator.userId === userId,
    );

    if (rate.rateType === 'Case') {
      if (!isEvalutor) {
        throw new NotFoundException('Rate not found');
      }
      const isFinished = rate.userRates.length >= rate.cases.length;
      if (isFinished) {
        throw new ForbiddenException('Rate already finished');
      }
      return rate;
    } else {
      if (
        (rate.userId !== userId && !isEvalutor) ||
        !rate.userConfirmed ||
        !rate.curatorConfirmed
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
  }

  async setEvaluators(id: number, data: SetEvaluatorsPayload) {
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
      this.prismaService.userComments.deleteMany({
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

    return { newEvaluators, evaluatorsToAdd, evaluatorsToDelete, rate };
  }
}
