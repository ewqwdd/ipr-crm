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
import { Prisma, QuestionType } from '@prisma/client';
import { AssignUsersDTO } from './dto/assign-users.dto';
import { ExcelService } from 'src/utils/excel/excel.service';
import { Response } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';

type AssignedType = Prisma.User_Assigned_TestGetPayload<{
  include: {
    answeredQUestions: { include: { options: true } };
    test: { include: { testQuestions: { include: { options: true } } } };
  };
}>;

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
    private excelService: ExcelService,
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

  countScore(test: AssignedType) {
    return test.answeredQUestions.reduce((acc, question) => {
      const questionData = test.test.testQuestions.find(
        (q) => q.id === question.questionId,
      );
      if (!questionData) return acc;
      if (
        questionData.type === QuestionType.SINGLE &&
        questionData.options.find((o) => o.isCorrect)
      ) {
        const answeredOption = question.options?.[0];
        const foundOption = questionData.options?.find(
          (o) => o.id === answeredOption?.optionId,
        );
        if (foundOption.isCorrect) {
          return acc + 1;
        }
      } else if (
        questionData.type === QuestionType.MULTIPLE &&
        questionData.options.find((o) => o.isCorrect)
      ) {
        const allCorrect = questionData.options?.filter((o) => o.isCorrect);
        const answeredOptions = question.options?.map((o) => o.optionId) || [];
        const allAnsweredCorrect = allCorrect?.every((o) =>
          answeredOptions.includes(o.id),
        );
        if (
          allAnsweredCorrect &&
          allCorrect?.length === answeredOptions.length
        ) {
          return acc + 1;
        }
      } else if (
        questionData.type === QuestionType.TEXT &&
        questionData.textCorrectValue
      ) {
        if (question.textAnswer === questionData.textCorrectValue) {
          return acc + 1;
        }
      } else if (
        questionData.type === QuestionType.NUMBER &&
        questionData.numberCorrectValue
      ) {
        if (question.numberAnswer === questionData.numberCorrectValue) {
          return acc + 1;
        }
      }
      return acc;
    }, 0);
  }

  async getTests(name?: string, startDate?: Date, endDate?: Date) {
    const filters = {
      ...(name ? { name: { contains: name } } : {}),
      ...(startDate ? { startDate: { gte: startDate } } : {}),
      ...(endDate ? { endDate: { lte: endDate } } : {}),
      archived: false,
    };

    const tests = await this.prismaService.test.findMany({
      include: {
        testQuestions: {
          where: {
            archived: false,
          },
          include: {
            options: {
              where: {
                archived: false,
              },
            },
          },
        },
        usersAssigned: {
          select: {
            id: true,
            finished: true,
            userId: true,
            startDate: true,
            endDate: true,
            availableFrom: true,
            user: {
              select: {
                username: true,
                firstName: true,
                lastName: true,
                id: true,
              },
            },
            answeredQUestions: {
              select: {
                questionId: true,
                textAnswer: true,
                numberAnswer: true,
                options: {
                  select: {
                    optionId: true,
                  },
                },
              },
            },
          },
        },
      },
      ...(Object.keys(filters).length > 0 ? { where: filters } : {}),
      orderBy: {
        id: 'desc',
      },
    });

    const projectTests = tests.map((test) => {
      if (!test.anonymous) return test;
      return {
        ...test,
        usersAssigned: test.usersAssigned.map((userAssigned) => ({
          ...userAssigned,
          user: {
            id: -1,
            firstName: 'Аноним',
            lastName: '',
            username: 'Аноним',
          },
        })),
      };
    });

    return projectTests;
  }

  async getTestAdmin(id: number, sessionInfo: GetSessionInfoDto) {
    await this.checkAccess(sessionInfo);

    const test = await this.prismaService.test.findUnique({
      where: {
        id,
        archived: false,
      },
      include: {
        testQuestions: {
          where: {
            archived: false,
          },
          include: {
            options: {
              where: {
                archived: false,
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Тест не найден');

    return test;
  }

  async getTest(id: number, sessionInfo: GetSessionInfoDto) {
    const test = await this.prismaService.test.findUnique({
      where: {
        id,
        archived: false,
        hidden: false,
        OR: [
          {
            access: 'PUBLIC',
          },
          {
            access: 'LINK_ONLY',
          },
          {
            access: 'PRIVATE',
            usersAssigned: {
              some: {
                userId: sessionInfo.id,
              },
            },
          },
        ],
      },
      include: {
        testQuestions: {
          where: {
            archived: false,
          },
          include: {
            options: {
              where: {
                archived: false,
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Тест не найден');

    return test;
  }

  async getAssignedTests(sessionInfo: GetSessionInfoDto) {
    return (
      await this.prismaService.user_Assigned_Test.findMany({
        where: {
          userId: sessionInfo.id,
          finished: false,
          OR: [
            {
              availableFrom: {
                lte: new Date(new Date().setHours(23, 59, 59, 999)),
              },
            },
            {
              availableFrom: null,
            },
          ],
          test: {
            // TODO: добавить проверку на доступность теста
            hidden: false,
            archived: false,
          },
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
        orderBy: {
          id: 'desc',
        },
      })
    ).filter(
      (test) =>
        !test.test.startDate ||
        test.test.startDate <= new Date(new Date().setHours(23, 59, 59, 999)),
    );
  }

  async getAssignedTest(testId: number, sessionInfo: GetSessionInfoDto) {
    const test = await this.prismaService.user_Assigned_Test.findFirst({
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
          archived: false,
          // TODO: добавить проверку на доступность теста
          hidden: false,
        },
        finished: false,
      },
      include: {
        test: {
          include: {
            testQuestions: {
              where: {
                archived: false,
              },
              select: {
                id: true,
                allowDecimal: true,
                description: true,
                maxLength: true,
                maxNumber: true,
                minNumber: true,
                label: true,
                required: true,
                type: true,
                options: {
                  where: {
                    archived: false,
                  },
                  select: {
                    value: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
        answeredQUestions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Тест не найден');
    }

    return test;
  }

  async startAssesment(testId: number, sessionInfo: GetSessionInfoDto) {
    const test = await this.prismaService.user_Assigned_Test.findFirst({
      where: {
        user: {
          id: sessionInfo.id,
        },
        id: testId,
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
          teams: { some: { teamId: { in: teamIds } } },
        },
        select: { id: true },
      });

      const teamUserIds = new Set(teamUsers.map((user) => user.id));
      allowedUsers = userIds.filter((id) => teamUserIds.has(id));
    }
    const test = await this.prismaService.test.findFirst({
      where: {
        id: testId,
      },
    });

    if (!test) {
      throw new NotFoundException('Тест не найден');
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
          availableFrom: startDate
            ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
            : undefined,
          firstNotificationSent: false,
        })),
        skipDuplicates: true, // на всякий случай
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

  projectFields = (test: AssignedType) => {
    return {
      ...test,
      questionsCount: test.test.testQuestions.length,
      answeredQUestions: null,
      test: {
        ...test.test,
        testQuestions: null,
      },
    };
  };

  async getFinishedTestForUser(
    assignedId: number,
    sessionInfo: GetSessionInfoDto,
  ) {
    const test = await this.prismaService.user_Assigned_Test.findFirst({
      where: {
        id: assignedId,
        userId: sessionInfo.id,
      },
      include: {
        answeredQUestions: {
          include: {
            options: true,
          },
        },
        test: {
          include: {
            testQuestions: {
              where: {
                archived: false,
              },
              include: {
                options: {
                  where: {
                    archived: false,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Тест не найден');

    if (test.test.showScoreToUser) {
      const count = this.countScore(test);
      return {
        ...this.projectFields(test),
        score: count,
      };
    }
    return this.projectFields(test);
  }

  async getFinishedTests(sessionInfo: GetSessionInfoDto) {
    const finishedTests = await this.prismaService.user_Assigned_Test.findMany({
      where: {
        userId: sessionInfo.id,
        finished: true,
      },
      include: {
        test: {
          include: {
            testQuestions: {
              where: {
                archived: false,
              },
              include: {
                options: {
                  where: {
                    archived: false,
                  },
                },
              },
            },
          },
        },
        answeredQUestions: {
          include: {
            options: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const withResults = finishedTests.map((test) => {
      if (test.test.showScoreToUser) {
        const score = this.countScore(test);
        return {
          ...this.projectFields(test),
          score,
        };
      } else {
        return this.projectFields(test);
      }
    });
    return withResults;
  }

  async checkAccess(sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role === 'admin') {
      return true;
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: sessionInfo.id,
      },
      include: {
        teamCurator: { select: { id: true } },
      },
    });

    if (user?.teamCurator?.length > 0) return user;
    throw new ForbiddenException();
  }

  async toggleTestHidden(
    testid: number,
    hidden: boolean,
    sessionInfo: GetSessionInfoDto,
  ) {
    await this.checkAccess(sessionInfo);
    const test = await this.prismaService.test.findFirst({
      where: {
        id: testid,
      },
    });
    if (!test) throw new NotFoundException('Тест не найден');

    return await this.prismaService.test.update({
      where: {
        id: testid,
      },
      data: {
        hidden,
      },
    });
  }

  async notifyTestAssigned(testId: number, sessionInfo: GetSessionInfoDto) {
    const access = await this.checkAccess(sessionInfo);

    let filters = {};
    if (typeof access !== 'boolean') {
      filters = {
        usersAssigned: {
          every: {
            user: {
              teams: {
                some: {
                  id: {
                    in: access.teamCurator.map((team) => team.id),
                  },
                },
              },
            },
          },
        },
      };
    }

    const test = await this.prismaService.user_Assigned_Test.findMany({
      where: {
        test: {
          ...filters,
          id: testId,
          hidden: false,
          archived: false,
        },
        finished: false,
      },
    });

    if (!test) throw new NotFoundException('Тест не найден');
    const userIds = test.map((t) => t.userId);
    const promisesNotifs = userIds.map((userId) =>
      this.notificationsService.sendTestAssignedNotification(userId, testId),
    );
    await Promise.all(promisesNotifs);
    return true;
  }

  async generateResults(
    res: Response,
    testId: number,
    sessionInfo: GetSessionInfoDto,
  ) {
    const access = await this.checkAccess(sessionInfo);

    let filters = {};
    if (typeof access !== 'boolean') {
      filters = {
        usersAssigned: {
          every: {
            user: {
              teams: {
                some: {
                  id: {
                    in: access.teamCurator.map((team) => team.id),
                  },
                },
              },
            },
          },
        },
      };
    }

    const test = await this.prismaService.user_Assigned_Test.findMany({
      where: {
        test: {
          ...filters,
          id: testId,
        },
      },
      include: {
        test: {
          include: {
            testQuestions: {
              where: {
                archived: false,
              },
              include: {
                options: {
                  where: {
                    archived: false,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
        answeredQUestions: {
          include: {
            options: true,
          },
        },
      },
    });
    if (!test) throw new NotFoundException('Тест не найден');

    const questions = test.flatMap((t) => t.test.testQuestions);
    const ids = Array.from(new Set(questions.map((q) => q.id)));

    const keys = [
      'id',
      'name',
      ...ids.flatMap((id) => [String(id), `ans_${id}`]),
      'score',
      'finished',
    ];

    const results = test.map<Record<(typeof keys)[number], number | string>>(
      (t) => {
        let count = 0;
        const questionsToExcel = {};

        t.test.testQuestions.forEach((q) => {
          const answer = t.answeredQUestions.find((a) => a.questionId === q.id);

          let value;
          let isCorrect = false;
          if (q.type === QuestionType.SINGLE) {
            const answeredOption = answer?.options?.[0];
            const foundOption = q.options?.find(
              (o) => o.id === answeredOption?.optionId,
            );
            value = foundOption?.value || '';
            if (foundOption?.isCorrect) {
              count++;
              isCorrect = true;
            }
          } else if (q.type === QuestionType.MULTIPLE) {
            const allCorrect = q.options?.filter((o) => o.isCorrect);
            const answeredOptions =
              answer?.options?.map((o) => o.optionId) || [];
            const allAnsweredCorrect = allCorrect?.every((o) =>
              answeredOptions.includes(o.id),
            );
            value =
              answeredOptions
                .map((o) => q.options?.find((opt) => opt.id === o)?.value)
                .join(', ') || '';
            if (
              allAnsweredCorrect &&
              allCorrect?.length === answeredOptions.length
            ) {
              count++;
              isCorrect = true;
            }
          } else if (q.type === QuestionType.TEXT) {
            value = answer?.textAnswer || '';
            if (answer?.textAnswer === q.textCorrectValue) {
              count++;
              isCorrect = true;
            }
          } else if (q.type === QuestionType.NUMBER) {
            value = answer?.numberAnswer || '';
            if (answer?.numberAnswer === q.numberCorrectValue) {
              count++;
              isCorrect = true;
            }
          }

          questionsToExcel[String(q.id)] = value;
          questionsToExcel[`ans_${q.id}`] = isCorrect ? 'Да' : 'Нет';
        });

        return {
          id: t.userId,
          name: t.test.anonymous ? 'Анонимно' : (t.user?.username ?? 'Неизвестный'),
          ...questionsToExcel,
          score: count,
          finished: t.finished ? 'Да' : 'Нет',
        };
      },
    );

    const questionsHeaders = {};

    ids.forEach((id) => {
      const question = questions.find((q) => q.id === id);
      if (question) {
        questionsHeaders[String(id)] = question.label;
        questionsHeaders[`ans_${id}`] = 'Правильный ответ';
      }
    });

    const headers: Record<(typeof keys)[number], string> = {
      id: 'ID',
      name: 'Имя',
      ...questionsHeaders,
      score: 'Баллы',
      finished: 'Завершен',
    };

    await this.excelService.generateExcel(res, {
      keys,
      headers,
      name: 'Результаты теста',
      rows: results,
    });
  }

  async deleteTest(testId: number, sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role !== 'admin') throw new ForbiddenException();

    const test = await this.prismaService.test.findFirst({
      where: {
        id: testId,
      },
    });
    if (!test) throw new NotFoundException('Тест не найден');

    return await this.prismaService.test.update({
      where: {
        id: testId,
      },
      data: {
        archived: true,
      },
    });
  }

  async editTest(
    testId: number,
    data: CreateTestDTO,
    sessionInfo: GetSessionInfoDto,
  ) {
    await this.checkAccess(sessionInfo);

    const test = await this.prismaService.test.findFirst({
      where: {
        id: testId,
      },
    });
    if (!test) throw new NotFoundException('Тест не найден');

    const updatedTest = await this.prismaService.test.update({
      where: {
        id: testId,
      },
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

    const questions = await this.prismaService.question.findMany({
      where: {
        testId: testId,
        archived: false,
      },
      include: {
        options: true,
        answeredQuestions: true,
      },
    });

    for (const question of questions) {
      const found = data.questions.find((q) => q.id === question.id);
      if (!found) {
        await this.prismaService.question.update({
          where: {
            id: question.id,
          },
          data: {
            archived: true,
          },
        });
      } else {
        await this.prismaService.question.update({
          where: {
            id: question.id,
          },
          data: {
            label: found.label,
            type: found.type,
            description: found.description ?? null,
            maxLength: found.maxLength ?? null,
            maxNumber: found.maxNumber ?? null,
            minNumber: found.minNumber ?? null,
            numberCorrectValue: found.numberCorrectValue ?? null,
            required: !!found.required,
            textCorrectValue: found.textCorrectValue ?? null,
            allowDecimal: !!found.allowDecimal,
          },
        });
        const options = await this.prismaService.option.findMany({
          where: {
            questionId: question.id,
            archived: false,
          },
        });

        for (const option of options) {
          const foundOption = found.options?.find((o) => o.id === option.id);
          if (!foundOption) {
            await this.prismaService.option.update({
              where: {
                id: option.id,
              },
              data: {
                archived: true,
              },
            });
          } else {
            await this.prismaService.option.update({
              where: {
                id: option.id,
              },
              data: {
                value: foundOption.value,
                isCorrect: foundOption.isCorrect,
              },
            });
          }
        }

        const newOptions =
          found.options
            ?.filter((o) => !o.id)
            .map((o) => ({
              value: o.value,
              isCorrect: o.isCorrect,
            })) || [];

        if (newOptions.length > 0) {
          await this.prismaService.option.createMany({
            data: newOptions.map((o) => ({
              questionId: question.id,
              ...o,
            })),
          });
        }
      }
    }

    const newQuestions = data.questions
      .filter((q) => !q.id)
      .map((question, index) =>
        this.prismaService.question.create({
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
                id: updatedTest.id,
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
        }),
      );

    await Promise.all(newQuestions);
    return updatedTest;
  }

  // @Cron('* * * * *')
  @Cron(CronExpression.EVERY_MINUTE, {name: 'completeTimeLimitTestAssignedCron'})
  async completeTimeLimitTestAssignedCron() {
    try {
      console.log('Запуск крон завершения тестов по времени');
      const tests = await this.prismaService.user_Assigned_Test.findMany({
        where: {
          startDate: {
            not: null,
          },
          test: {
            limitedByTime: true,
            archived: false,
          },
          finished: false,
        },
        include: {
          test: {
            select: {
              timeLimit: true,
            },
          },
        },
      });

      let count = 0;
      for (const test of tests) {
        const startTime = test.startDate.getTime();
        const currentTime = new Date().getTime();

        if (currentTime - startTime >= test.test.timeLimit * 60 * 1000) {
          await this.prismaService.user_Assigned_Test.update({
            where: {
              id: test.id,
            },
            data: {
              finished: true,
              endDate: new Date(),
            },
          });
          await this.notificationsService.sendTestAssignedTimeOver(
            test.userId,
            test.id,
          );
          count++;
        }
      }

      console.log(`Завершено ${count} тестов по времени`);
    } catch (e) {
      console.log('Ошибка в кроне завершения тестов по времени', e);
    }
  }

  // @Cron('* * * * *')
  @Cron('0 0 * * *', {name: 'finishEndDateTestAssignedCron'})
  async finishEndDateTestAssignedCron() {
    console.log('Запуск крон завершения тестов по дате');
    try {
      const tests = await this.prismaService.user_Assigned_Test.findMany({
        where: {
          test: {
            archived: false,
            endDate: {
              not: null,
            },
          },
          finished: false,
        },
        include: {
          test: {
            select: {
              endDate: true,
            },
          },
        },
      });

      let count = 0;
      for (const test of tests) {
        const endTime = test.test.endDate.getTime();
        const currentTime = new Date().getTime();

        if (currentTime >= endTime) {
          await this.prismaService.user_Assigned_Test.update({
            where: {
              id: test.id,
            },
            data: {
              finished: true,
              endDate: new Date(),
            },
          });
          await this.notificationsService.sendTestAssignedTimeOver(
            test.userId,
            test.id,
          );
          count++;
        }
      }
      console.log(`Завершено ${count} тестов по дате`);
    } catch (e) {
      console.log('Ошибка в кроне завершения тестов по дате', e);
    }
  }
}
