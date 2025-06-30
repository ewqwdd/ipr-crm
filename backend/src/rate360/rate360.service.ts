import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { EvaluatorType, Prisma, SkillType } from '@prisma/client';
import { RatingsDto } from './dto/user-assesment.dto';
import { ConfirmRateDto } from './dto/confirm-rate.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { ToggleReportVisibilityDto } from './dto/toggle-report-visibility.dto';
import { SingleRateIdDto } from './dto/single-rate-id.dto';
import { SingleCommentDto } from './dto/single-comment.dto';
import { DeleteEvaluatorsDto } from './dto/delete-evaluators.dto';
import { AddEvaluatorsDto } from './dto/add-evalators.dto';
import { RateFiltersDto } from './dto/rate-filters.dto';
import { UsersAccessService } from 'src/users/users-access.service';
import { findAllRateInclude } from './constants';
import { TeamsHelpersService } from 'src/teams/teams.helpers.service';
import { findHierarchyElements } from './helpers';
import { NotificationsService } from 'src/notification/notifications.service';
import { MultipleRateIdDto } from './dto/multiple-rate-id.dto';

@Injectable()
export class Rate360Service {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
    private usersService: UsersAccessService,
    private teamsHelperService: TeamsHelpersService,
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
    const allowedTeamIds =
      await this.usersService.findAllowedTeams(sessionInfo);

    return {
      team: {
        id: { in: allowedTeamIds },
      },
    };
  }

  findAllFilters({
    endDate,
    skill,
    specId,
    startDate,
    status,
    user,
    hidden,
  }: RateFiltersDto): Prisma.Rate360FindManyArgs['where'] {
    return {
      archived: false,
      ...(user ? { userId: user } : {}),
      ...(specId ? { specId } : {}),
      ...(skill ? { type: skill } : {}),
      ...(status === 'COMPLETED' ? { finished: true } : {}),
      ...(status === 'NOT_COMPLETED' ? { finished: false } : {}),
      ...(status === 'NOT_CONFIRMED' ? { curatorConfirmed: false } : {}),
      ...(startDate ? { startDate: { gte: new Date(startDate) } } : {}),
      ...(endDate ? { endDate: { lte: new Date(endDate) } } : {}),
      hidden: !!hidden,
    };
  }

  async findAll(data: RateFiltersDto, curator: GetSessionInfoDto) {
    const teamAccess = await this.usersService.findAllowedTeams(curator);
    const teamFilter = {
      product: data.product,
      department: data.department,
      direction: data.direction,
      group: data.group,
    };
    const isTeamFilter = Object.values(teamFilter).filter(Boolean).length > 0;
    const { page, limit } = data;

    const where = this.findAllFilters(data);

    where.team = {
      id: {
        in: teamAccess,
      },
    };

    if (isTeamFilter) {
      const ids = [
        teamFilter.group,
        teamFilter.direction,
        teamFilter.department,
        teamFilter.product,
      ].filter(Boolean) as number[];
      if (ids.some((id) => !teamAccess.includes(id))) return [];
      // const recur = (ids: number[]): Prisma.Rate360WhereInput['team'] => {
      //   const current = ids.shift();
      //   if (!current) return undefined;
      //   return {
      //     id: current,
      //     parentTeam: {
      //       ...recur(ids),
      //     }
      //   }
      // }
      where.team = {
        id: ids[0],
      };
    }

    if (curator?.id && data.includeWhereEvaluatorCurator) {
      if (!isTeamFilter) {
        delete where.team;
      }
      const or = [
        {
          team: { id: { in: teamAccess } },
        },
        {
          evaluators: {
            some: {
              type: EvaluatorType.CURATOR,
              userId: curator.id,
            },
          },
        },
      ];
      if (!where.OR) {
        where.OR = or;
      } else if (!where.AND) {
        where.AND = [{ OR: where.OR }, { OR: or }];
      } else {
        where.AND = [
          ...(Array.isArray(where.AND) ? where.AND : []),
          { OR: or },
          { OR: where.OR },
        ];
        delete where.OR;
      }
    }

    let [total, rates] = await this.prismaService.$transaction([
      this.prismaService.rate360.count({ where }),
      this.prismaService.rate360.findMany({
        where,
        include: findAllRateInclude,
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

  async findAllSubbordinates(data: RateFiltersDto, curatorId: number) {
    const { page, limit } = data;

    const where = this.findAllFilters(data);

    where.evaluators = {
      some: {
        type: EvaluatorType.CURATOR,
        userId: curatorId,
      },
    };

    let [total, rates] = await this.prismaService.$transaction([
      this.prismaService.rate360.count({ where }),
      this.prismaService.rate360.findMany({
        where,
        include: findAllRateInclude,
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

  async findFolderdsForRates(
    teamIds: number[],
    specIds: number[],
    skill: SkillType[],
  ) {
    const [products, teams, specs] = await Promise.all([
      this.teamsHelperService.findRootTeamsForMultiple(teamIds),
      this.prismaService.team.findMany({
        where: {
          id: { in: teamIds },
        },
        select: {
          id: true,
          name: true,
        },
      }),
      this.prismaService.spec.findMany({
        where: {
          id: { in: specIds },
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const folders =
      await this.prismaService.profileConstructorFolderProduct.findMany({
        where: {
          name: {
            in: Array.from(products.values()).map((product) => product.name),
          },
        },
        include: {
          teams: {
            where: {
              name: {
                in: teams.map((team) => team.name),
              },
            },
            include: {
              specs: {
                where: {
                  name: {
                    in: specs.map((spec) => spec.name),
                  },
                },
                include: {
                  competencyBlocks: {
                    where: {
                      archived: false,
                      type: {
                        in: skill,
                      },
                    },
                    select: {
                      id: true,
                      type: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    return {
      folders,
      products,
      teams,
      specs,
    };
  }

  async createRate(data: CreateRateDto, sessionInfo: GetSessionInfoDto) {
    const { rate, skill, confirmCurator, confirmUser } = data;
    if (sessionInfo.role !== 'admin')
      throw new ForbiddenException('You are not allowed to create this rate');

    const { folders, products, specs } = await this.findFolderdsForRates(
      rate.map((r) => r.teamId),
      rate.flatMap((team) => team.specs.map((spec) => spec.specId)),
      skill,
    );

    return this.prismaService.$transaction(
      async (tx) => {
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

        const folderCompetencyBlocks = folders.flatMap((folder) =>
          folder.teams.flatMap((team) =>
            team.specs.flatMap((spec) =>
              spec.competencyBlocks.map((block) => ({
                ...block,
              })),
            ),
          ),
        );

        const competencyBlocks = await tx.competencyBlock.findMany({
          where: {
            OR: [
              {
                specs: {
                  some: {
                    id: { in: ratesToCreate.map((rate) => rate.specId) },
                  },
                },
              },
              {
                id: { in: folderCompetencyBlocks.map((block) => block.id) },
              },
            ],
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
            const curator = rate.evaluateCurators[0];
            const team = await tx.team.findUnique({
              where: { id: rate.teamId },
              select: { name: true },
            });

            let curatorNeedConfirm =
              data.confirmCurator && curator.userId !== rate.userId;

            if (data.confirmUser) {
              await this.notificationsService.sendRateConfirmNotification(
                rate.userId,
                createdRates[index].id,
                tx,
              );
            } else if (curatorNeedConfirm) {
              await this.notificationsService.sendRateConfirmNotification(
                curator.userId,
                createdRates[index].id,
                tx,
              );
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

            const userProduct = products.get(rate.teamId);
            const userSpec = specs.find((spec) => spec.id === rate.specId);
            const foundFolder = findHierarchyElements(
              folders,
              userProduct?.name,
              team.name,
              userSpec?.name,
            );

            const skills =
              foundFolder?.spec?.competencyBlocks.filter(
                (block) => block.type === rate.type,
              ) ?? [];

            return await tx.rate360.update({
              where: { id: createdRates[index].id },
              data: {
                curatorConfirmed: !curatorNeedConfirm,
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
                  connect:
                    skills.length > 0
                      ? skills.map((skill) => ({ id: skill.id }))
                      : competencyBlocks
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
      },
      {
        maxWait: 45000,
        timeout: 40000,
      },
    );
  }

  async findAssignedRates(userId: number) {
    const rate360 = await this.prismaService.rate360.findMany({
      where: {
        // finished: false,
        hidden: false,
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

    // const filtered = rate360.filter((rate) => {
    //   const indicators = rate.competencyBlocks
    //     .filter((c) => c.type === rate.type)
    //     .flatMap((block) =>
    //       block.competencies.flatMap((competency) => competency.indicators),
    //     );
    //   const userRates = rate.userRates.filter(
    //     (rate) => rate.userId === userId && rate.approved,
    //   );
    //   return userRates.length < indicators.length;
    // });
    return rate360;
  }

  async findSelfRates(userId: number) {
    const rate360 = await this.prismaService.rate360.findMany({
      where: {
        // finished: false,
        userId,
        userConfirmed: true,
        curatorConfirmed: true,
        archived: false,
        hidden: false,
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

  async singleAssessment(
    userId: number,
    indicatorId: number,
    data: SingleRateIdDto,
  ) {
    const { rate, rateId } = data;
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

  async multipleAssessment(userId: number, data: MultipleRateIdDto) {
    const { rates, rateId } = data;
    const found = await this.findForUser(userId, rateId);
    if (!found) {
      throw new NotFoundException('Rate not found');
    }

    await this.prismaService.userRates.deleteMany({
      where: {
        userId,
        rate360Id: rateId,
        indicatorId: {
          in: rates.map((r) => r.indicatorId),
        },
      },
    });

    await this.prismaService.userRates.createMany({
      data: rates.map((r) => ({
        userId,
        rate360Id: rateId,
        indicatorId: r.indicatorId,
        rate: r.rate,
      })),
    });
    return HttpStatus.OK;
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
            firstName: true,
            lastName: true,
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
        evaluators: {
          some: {
            userId,
            type: EvaluatorType.CURATOR,
          },
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
            firstName: true,
            lastName: true,
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

    return rates;
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
        evaluators: {
          some: {
            userId: curatorId,
            type: EvaluatorType.CURATOR,
          },
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
        team: {
          select: {
            curatorId: true,
            parentTeam: {
              select: {
                curatorId: true,
              },
            },
          },
        },
        user: true,
        evaluators: {
          select: {
            userId: true,
            type: true,
          },
        },
      },
    });
    if (!rate) {
      throw new NotFoundException('Rate not found');
    }

    const curator = rate.evaluators[0];

    if (!rate.userConfirmed) {
      await this.notificationsService.sendRateSelfAssignedNotification(
        rate.userId,
        rateId,
      );
    } else if (!rate.curatorConfirmed) {
      await this.notificationsService.sendRateConfirmNotification(
        curator.userId,
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

  async archiveRate(ids: number[], sessionInfo: GetSessionInfoDto) {
    const query: Prisma.Rate360UpdateManyArgs = {
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        hidden: true,
      },
    };

    if (sessionInfo.role !== 'admin') {
      const teamAccess = await this.usersService.findAllowedTeams(sessionInfo);
      query.where = {
        ...query.where,
        team: {
          id: { in: teamAccess },
        },
      };
    }

    return await this.prismaService.rate360.updateMany(query);
  }
}
