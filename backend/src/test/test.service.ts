import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { CreateTestDTO } from './dto/create-test.dto';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { AnswerQuestionDTO } from './dto/answer-question.dto';
import { Prisma } from '@prisma/client';
import { AssignUsersDTO } from './dto/assign-users.dto';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createTest(data: CreateTestDTO) {
    const created = await this.prismaService.test.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        access: data.access,
        anonymous: data.anonymous,
        failedMessage: data.failedMessage,
        passedMessage: data.passedMessage,
        finishMessage: data.finishMessage,
        limitedByTime: data.limitedByTime,
        minimumScore: data.minimumScore,
        showScoreToUser: data.showScoreToUser,
        timeLimit: data.timeLimit,
      },
    });

    data.questions.forEach(async (question, index) => {
      await this.prismaService.question.create({
        data: {
          label: question.label,
          type: question.type,
          order: index,
          description: question.description,
          maxLength: question.maxLength,
          maxNumber: question.maxNumber,
          minNumber: question.minNumber,
          numberCorrectValue: question.numberCorrectValue,
          required: question.required,
          textCorrectValue: question.textCorrectValue,
          Test: {
            connect: {
              id: created.id,
            },
          },
          ...(question.options
            ? {
                options: {
                  createMany: {
                    data: question.options.map((option) => ({
                      value: option.value,
                      isCorrect: option.isCorrect,
                    })),
                  },
                },
              }
            : {}),
        },
      });
    });

    return created;
  }

  async getTests(name?: string, startDate?: Date, endDate?: Date) {
    const filters = {
      ...(name ? { name: { contains: name } } : {}),
      ...(startDate ? { startDate: { gte: startDate } } : {}),
      ...(endDate ? { endDate: { lte: endDate } } : {}),
    };

    return this.prismaService.test.findMany({
      include: {
        testQuestions: {
          include: {
            options: true,
          },
        },
        usersAssigned: {
          select: {
            finished: true,
            userId: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      ...(Object.keys(filters).length > 0 ? { where: filters } : {}),
    });
  }

  async getTest(id: number, sessionInfo: GetSessionInfoDto) {
    return this.prismaService.test.findUnique({
      where: {
        id,
        // OR: [
        //   {
        //     access: 'PUBLIC',
        //   },
        //   {
        //     access: 'LINK_ONLY',
        //   },
        //   {
        //     access: 'PRIVATE',
        //     usersAssigned: {
        //       some: {
        //         userId: sessionInfo.id,
        //       },
        //     },
        //   },
        // ],
      },
      include: {
        testQuestions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async getAssignedTests(sessionInfo: GetSessionInfoDto) {
    return (
      await this.prismaService.user_Assigned_Test.findMany({
        where: {
          userId: sessionInfo.id,
          finished: false,
          OR: [
            {
              startDate: {
                lte: new Date(new Date().setHours(23, 59, 59, 999)),
              },
            },
            {
              startDate: null,
            },
          ],
        },
        include: {
          test: {
            select: {
              name: true,
              endDate: true,
              startDate: true,
            },
          },
        },
      })
    ).filter(
      (test) =>
        !test.test.startDate ||
        test.test.startDate <= new Date(new Date().setHours(23, 59, 59, 999)),
    );
  }

  async getAssignedTest(testId: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.user_Assigned_Test.findFirst({
      where: {
        id: testId,
        userId: sessionInfo.id,
        OR: [
          {
            availableFrom: {
              lte: new Date(),
            },
          },
          {
            availableFrom: null,
          },
        ],
        test: {
          access: 'PRIVATE',
          archived: false,
          hidden: false,
        },
      },
      include: {
        test: {
          include: {
            testQuestions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });
  }

  async startAssesment(testId: number, sessionInfo: GetSessionInfoDto) {
    const test = await this.prismaService.user_Assigned_Test.findFirst({
      where: {
        userId: sessionInfo.id,
        testId,
        finished: false,
      },
    });

    if (!test) {
      throw new NotFoundException();
    }

    if (test.startDate) {
      return test;
    }

    return await this.prismaService.user_Assigned_Test.update({
      where: {
        id: test.id,
      },
      data: {
        startDate: new Date(),
      },
    });
  }

  async answerQuestion(
    assignedId: number,
    sessionInfo: GetSessionInfoDto,
    answer: AnswerQuestionDTO,
  ) {
    const test = await this.prismaService.user_Assigned_Test.findFirst({
      where: {
        id: assignedId,
        userId: sessionInfo.id,
      },
    });

    if (!test) {
      throw new NotFoundException();
    }

    const question = await this.prismaService.question.findFirst({
      where: {
        id: answer.questionId,
      },
    });

    if (!question) {
      throw new NotFoundException();
    }

    const dataToSet: Pick<
      Prisma.UserAnsweredQuestionCreateInput,
      'numberAnswer' | 'options' | 'textAnswer'
    > = {};

    if (question.type === 'TEXT') {
      dataToSet.textAnswer = answer.textAnswer;
    } else if (question.type === 'NUMBER') {
      dataToSet.numberAnswer = answer.numberAnswer;
    } else if (question.type === 'SINGLE' || question.type === 'MULTIPLE') {
      dataToSet.options = {
        createMany: {
          data: answer.optionAnswer.map((optionId) => ({
            optionId,
          })),
        },
      };
    }

    const foundAnswer = await this.prismaService.userAnsweredQuestion.findFirst(
      {
        where: {
          questionId: answer.questionId,
          assignedTestId: assignedId,
        },
      },
    );

    if (!foundAnswer) {
      return await this.prismaService.userAnsweredQuestion.create({
        data: {
          ...dataToSet,
          assignedTestId: assignedId,
          questionId: answer.questionId,
          userId: sessionInfo.id,
        },
      });
    } else {
      await this.prismaService.userAnsweredQuestionOption.deleteMany({
        where: {
          userAnsweredQuestionId: foundAnswer.id,
        },
      });
      return await this.prismaService.userAnsweredQuestion.update({
        where: {
          id: foundAnswer.id,
        },
        data: {
          ...dataToSet,
        },
      });
    }
  }

  async assignUsers(
    testId: number,
    { userIds, startDate }: AssignUsersDTO,
    sessionInfo: GetSessionInfoDto,
  ) {
    let allowedUsers = userIds;

    if (sessionInfo.role !== 'admin') {
      const user = await this.prismaService.user.findFirst({
        where: { id: sessionInfo.id },
        include: {
          teamCurator: { select: { id: true } },
        },
      });

      if (!user?.teamCurator?.length) throw new ForbiddenException();

      const teamIds = user.teamCurator.map((team) => team.id);

      const teamUsers = await this.prismaService.user.findMany({
        where: {
          teams: { some: { id: { in: teamIds } } },
        },
        select: { id: true },
      });

      const teamUserIds = new Set(teamUsers.map((user) => user.id));
      allowedUsers = userIds.filter((id) => teamUserIds.has(id));
    }

    const existingAssignments =
      await this.prismaService.user_Assigned_Test.findMany({
        where: {
          testId,
          userId: {
            in: allowedUsers,
          },
          finished: false,
        },
        select: {
          userId: true,
        },
      });

    const userIdsWithActiveTest = new Set(
      existingAssignments.map((a) => a.userId),
    );
    const filteredUserIds = allowedUsers.filter(
      (id) => !userIdsWithActiveTest.has(id),
    );

    const createdAssignments =
      await this.prismaService.user_Assigned_Test.createMany({
        data: filteredUserIds.map((userId) => ({
          userId,
          testId,
          availableFrom: startDate ? new Date(startDate) : undefined,
        })),
        skipDuplicates: true, // на всякий случай
      });

    filteredUserIds.forEach(async (userId) => {
      await this.notificationsService.sendTestAssignedNotification(
        userId,
        testId,
      );
    });

    return createdAssignments;
  }

  async finishTest(assignedId: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.user_Assigned_Test.update({
      where: {
        id: assignedId,
        userId: sessionInfo.id,
      },
      data: {
        finished: true,
        endDate: new Date(),
      },
    });
  }

  async getFinishedTests(sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.user_Assigned_Test.findMany({
      where: {
        userId: sessionInfo.id,
        finished: true,
      },
      include: {
        test: true,
      },
    });
  }
}
