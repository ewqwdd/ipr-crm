import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { EvaluatorType, Prisma, Rate360 } from '@prisma/client';
import { CreateCaseRateDto } from './dto/create-case-rate.dto';
import { AnswerCaseRateDto } from './dto/answer-case-rate.dto';
import { UsersAccessService } from 'src/users/users-access.service';
import { SetEvaluatorsDto } from './dto/ser-evaluators.dto';
import { AssesmentService } from 'src/shared/assesment/assesment.service';

@Injectable()
export class CaseService {
  constructor(
    private prismaService: PrismaService,
    private usersAccessService: UsersAccessService,
    private assesmentService: AssesmentService,
  ) {}

  transformCaseRate(
    rate: Prisma.Rate360GetPayload<{
      include: { cases: true; userRates: true; evaluators: true };
    }>,
    sessionInfo: GetSessionInfoDto,
    isCurator: boolean = false,
  ) {
    const isAdmin = sessionInfo.role === 'admin';
    const isAuthor = sessionInfo.id === rate.authorId;
    const isUser = sessionInfo.id === rate.userId;

    if (!isAdmin && !isAuthor && !isUser && !isCurator) {
      return false;
    }
    return {
      ...rate,
      cases: rate.cases.map((caseItem) => ({
        ...caseItem,
        avg:
          rate.userRates
            .filter((rateItem) => rateItem.caseId === caseItem.id)
            .reduce((acc, rateItem) => acc + rateItem.rate, 0) /
          rate.userRates.filter((rateItem) => rateItem.caseId === caseItem.id)
            .length,
      })),
      userRates: isAdmin ? rate.userRates : [],
      evaluators: isAdmin || isCurator || isAuthor ? rate.evaluators : [],
    };
  }

  async getCases() {
    return this.prismaService.case.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        id: 'asc',
      },
      where: {
        archived: false,
      },
    });
  }

  async deleteCase(id: number) {
    return this.prismaService.case.update({
      where: {
        id,
      },
      data: {
        archived: true,
      },
    });
  }

  async deleteMultipleCases(ids: number[]) {
    return this.prismaService.case.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        archived: true,
      },
    });
  }

  async createCase(data: CreateCaseDto) {
    return this.prismaService.case.create({
      data: {
        name: data.name,
        description: data.description,
        commentEnabled: data.commentEnabled,
        variants: {
          createMany: {
            data: data.variants,
          },
        },
      },
    });
  }

  async editCase(id: number, data: CreateCaseDto) {
    return this.prismaService.case.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        commentEnabled: data.commentEnabled,
        variants: {
          deleteMany: {},
          createMany: {
            data: data.variants,
          },
        },
      },
    });
  }

  async getCaseRates(sessionInfo: GetSessionInfoDto) {
    const isAdmin = sessionInfo.role === 'admin';

    const rates = await this.prismaService.rate360.findMany({
      where: {
        rateType: 'Case',
        ...(isAdmin
          ? {}
          : {
              userId: {
                in: (
                  await this.usersAccessService.findAllowedSubbordinates(
                    sessionInfo.id,
                  )
                ).filter((id) => id !== sessionInfo.id),
              },
            }),
      },
      include: {
        cases: {
          include: {
            variants: true,
          },
        },
        userRates: true,
        evaluators: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
        comments: true,
        user: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
        author: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const transformedRates = rates.map((rate) =>
      this.transformCaseRate(rate, sessionInfo, true),
    );

    return transformedRates.filter(Boolean);
  }

  async getMyCaseRates(sessionInfo: GetSessionInfoDto) {
    const rates = await this.prismaService.rate360.findMany({
      where: {
        rateType: 'Case',
        userId: sessionInfo.id,
        finished: true,
      },
      include: {
        cases: true,
        userRates: true,
        evaluators: true,
        comments: true,
        user: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
        author: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
      },
    });

    const transformedRates = rates.map((rate) =>
      this.transformCaseRate(rate, sessionInfo),
    );

    return transformedRates.filter(Boolean);
  }

  async createCaseRate(
    data: CreateCaseRateDto,
    sessionInfo: GetSessionInfoDto,
  ) {
    return this.prismaService.$transaction(
      data.users.map((userId) =>
        this.prismaService.rate360.create({
          data: {
            rateType: 'Case',
            type: 'SOFT',
            authorId: sessionInfo.id,
            globalCommentsEnabled: data.globalCommentsEnabled,
            userId: userId,
            cases: {
              connect: data.cases.map((caseId: number) => ({ id: caseId })),
            },
            evaluators: {
              createMany: {
                data: data.evaluators.map((evaluatorId: number) => ({
                  userId: evaluatorId,
                  type: EvaluatorType.TEAM_MEMBER,
                })),
              },
            },
          },
        }),
      ),
    );
  }

  async getAssignedCases(sessionInfo: GetSessionInfoDto) {
    return this.prismaService.rate360.findMany({
      where: {
        evaluators: {
          some: {
            userId: sessionInfo.id,
          },
        },
        rateType: 'Case',
        archived: false,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
        userRates: {
          where: {
            userId: sessionInfo.id,
          },
        },
        cases: {
          include: {
            variants: true,
          },
        },
      },
    });
  }

  async checkIfFinished(id: number) {
    const rate = await this.prismaService.rate360.findFirst({
      where: {
        id,
        archived: false,
      },
      include: {
        userRates: true,
        cases: true,
        evaluators: true,
      },
    });
    if (!rate) {
      return;
    }
    if (
      rate.userRates.length >= rate.cases.length * rate.evaluators.length &&
      !rate.finished
    ) {
      await this.prismaService.rate360.update({
        where: {
          id,
        },
        data: {
          finished: true,
        },
      });
    } else if (
      rate.finished &&
      rate.userRates.length < rate.cases.length * rate.evaluators.length
    ) {
      await this.prismaService.rate360.update({
        where: {
          id,
        },
        data: {
          finished: false,
        },
      });
    }
  }

  async answerCaseRate(
    id: number,
    data: AnswerCaseRateDto,
    sessionInfo: GetSessionInfoDto,
  ) {
    const foundRate = await this.prismaService.rate360.findFirst({
      where: {
        id,
        evaluators: {
          some: {
            userId: sessionInfo.id,
          },
        },
        archived: false,
        finished: false,
      },
    });

    if (!foundRate) {
      throw new NotFoundException('Rate not found');
    }

    if (foundRate.globalCommentsEnabled && data.globalComment) {
      await this.prismaService.userComments.create({
        data: {
          rate360Id: id,
          comment: data.globalComment,
          userId: sessionInfo.id,
        },
      });
    }

    await this.prismaService.userRates.createMany({
      data: data.rates.map((rate) => ({
        rate360Id: id,
        caseId: rate.caseId,
        rate: rate.rate,
        userId: sessionInfo.id,
        comment: rate.comment,
      })),
      skipDuplicates: true,
    });
    await this.checkIfFinished(id);
    return HttpStatus.OK;
  }

  async getCaseResult(id: number, sessionInfo: GetSessionInfoDto) {
    const rate = await this.prismaService.rate360.findFirst({
      where: { id },
      include: {
        cases: true,
        userRates: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
        evaluators: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
                avatar: true,
              },
            },
          },
        },
        author: {
          select: {
            username: true,
            id: true,
            avatar: true,
          },
        },
      },
    });
    const subbordinates =
      await this.usersAccessService.findAllowedSubbordinates(sessionInfo.id);
    const isCurator = subbordinates.includes(rate.userId);

    const transformedRate = this.transformCaseRate(
      rate,
      sessionInfo,
      isCurator,
    );
    if (!transformedRate) {
      throw new NotFoundException('Rate not found');
    }
    return transformedRate;
  }

  async setEvaluators(data: SetEvaluatorsDto) {
    await this.assesmentService.setEvaluators(data.rateId, {
      evaluateTeam: data.evaluators,
      evaluateCurators: [],
      evaluateSubbordinate: [],
    });

    await this.checkIfFinished(data.rateId);
    return HttpStatus.OK;
  }
}
