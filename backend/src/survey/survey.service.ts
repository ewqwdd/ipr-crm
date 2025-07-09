import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateSurveyDTO } from './dto/create-survey.dto';
import { AssignUsersDTO } from './dto/assign-users.dto';
import { AnswerQuestionDTO } from './dto/answer-question.dto';
import { Prisma } from '@prisma/client';
import { UsersAccessService } from 'src/users/users-access.service';
import { NotificationsService } from 'src/notification/notifications.service';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class SurveyService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
    private filesService: FilesService,
    private usersAccessService: UsersAccessService,
  ) {}

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

  async getAdminSurveys(sessionInfo: GetSessionInfoDto) {
    await this.checkAccess(sessionInfo);
    const surveys = await this.prismaService.survey.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        surveyQuestions: {
          include: {
            options: true,
          },
        },
        usersAssigned: {
          include: {
            user: true,
          },
        },
      },
      where: {
        archived: false,
      },
    });
    return surveys;
  }

  async createSurvey(data: CreateSurveyDTO, sessionInfo: GetSessionInfoDto) {
    await this.checkAccess(sessionInfo);
    const created = await this.prismaService.survey.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        access: data.access,
        anonymous: data.anonymous,
        archived: false,
        hidden: true,
        finishMessage: data.finishMessage,
      },
    });

    data.surveyQuestions.forEach(async (question, index) => {
      await this.prismaService.surveyQuestion.create({
        data: {
          label: question.label,
          type: question.type,
          required: question.required,
          order: question.order ?? index,
          maxLength: question.maxLength,
          maxNumber: question.maxNumber,
          minNumber: question.minNumber,
          scaleDots: question.scaleDots,
          scaleStart: question.scaleStart,
          scaleEnd: question.scaleEnd,
          archived: false,
          description: question.description,
          allowDecimal: question.allowDecimal,
          photoUrl: question.photoUrl,
          Survey: {
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

  async assignUsersToSurvey(
    surveyId: number,
    { userIds, startDate }: AssignUsersDTO,
    sessionInfo: GetSessionInfoDto,
  ) {
    let allowedUsers = userIds;

    if (sessionInfo.role !== 'admin') {
      const teamIds =
        await this.usersAccessService.findAllowedTeams(sessionInfo);

      const teamUsers = await this.prismaService.user.findMany({
        where: {
          OR: [
            { teams: { some: { teamId: { in: teamIds } } } },
            { teamCurator: { some: { id: { in: teamIds } } } },
          ],
        },
        select: { id: true },
      });

      const teamUserIds = new Set(teamUsers.map((user) => user.id));
      allowedUsers = userIds.filter((id) => teamUserIds.has(id));
    }
    const survey = await this.prismaService.survey.findFirst({
      where: {
        id: surveyId,
      },
    });

    if (!survey) {
      throw new NotFoundException('Тест не найден');
    }

    const existingAssignments =
      await this.prismaService.user_Assigned_Survey.findMany({
        where: {
          surveyId,
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
      await this.prismaService.user_Assigned_Survey.createMany({
        data: filteredUserIds.map((userId) => ({
          userId,
          surveyId,
          availableFrom: startDate
            ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
            : undefined,
          firstNotificationSent: false,
        })),
        skipDuplicates: true,
      });

    return createdAssignments;
  }

  async toggleSurveyHidden(
    surveyId: number,
    hidden: boolean,
    sessionInfo: GetSessionInfoDto,
  ) {
    await this.checkAccess(sessionInfo);
    const survey = await this.prismaService.survey.findFirst({
      where: {
        id: surveyId,
      },
    });
    if (!survey) throw new NotFoundException('Опрос не найден');

    return await this.prismaService.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        hidden: {
          set: hidden,
        },
      },
    });
  }

  async deleteSurvey(surveyId: number, sessionInfo: GetSessionInfoDto) {
    if (sessionInfo.role !== 'admin') throw new ForbiddenException();

    const test = await this.prismaService.survey.findFirst({
      where: {
        id: surveyId,
      },
    });
    if (!test) throw new NotFoundException('Опрос не найден');

    return await this.prismaService.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        archived: true,
      },
    });
  }

  async notifySurveyAssigned(surveyId: number, sessionInfo: GetSessionInfoDto) {
    let filters: Prisma.User_Assigned_SurveyWhereInput = {};

    if (sessionInfo.role !== 'admin') {
      const allowedTeams =
        await this.usersAccessService.findAllowedTeams(sessionInfo);

      filters = {
        user: {
          OR: [
            {
              teams: {
                some: {
                  id: {
                    in: allowedTeams,
                  },
                },
              },
            },
            {
              teamCurator: {
                some: {
                  id: {
                    in: allowedTeams,
                  },
                },
              },
            },
          ],
        },
      };
    }

    const surveys = await this.prismaService.user_Assigned_Survey.findMany({
      where: {
        ...filters,
        survey: {
          id: surveyId,
          hidden: false,
          archived: false,
        },
        finished: false,
      },
    });

    if (!surveys) throw new NotFoundException('Опрос не найден');
    const promisesNotifs = surveys.map((survey) =>
      this.notificationsService.sendSurveyAssignedNotification(
        survey.userId,
        survey.id,
      ),
    );
    await Promise.all(promisesNotifs);
    return { count: surveys.length };
  }

  async editSurvey(
    surveyId: number,
    data: CreateSurveyDTO,
    sessionInfo: GetSessionInfoDto,
  ) {
    await this.checkAccess(sessionInfo);

    const survey = await this.prismaService.survey.findFirst({
      where: {
        id: surveyId,
      },
    });
    if (!survey) throw new NotFoundException('Опрос не найден');

    const updatedSurvey = await this.prismaService.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        access: data.access,
        anonymous: data.anonymous,
        finishMessage: data.finishMessage,
      },
    });

    const questions = await this.prismaService.surveyQuestion.findMany({
      where: {
        surveyId: surveyId,
        archived: false,
      },
      include: {
        options: true,
        answeredQuestions: true,
      },
    });

    for (const question of questions) {
      const found = data.surveyQuestions.find((q) => q.id === question.id);
      if (!found) {
        await this.prismaService.surveyQuestion.update({
          where: {
            id: question.id,
          },
          data: {
            archived: true,
          },
        });
      } else {
        await this.prismaService.surveyQuestion.update({
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
            required: !!found.required,
            allowDecimal: !!found.allowDecimal,
            scaleDots: found.scaleDots ?? null,
            scaleStart: found.scaleStart ?? null,
            scaleEnd: found.scaleEnd ?? null,
            order: found.order ?? question.order,
            photoUrl: found.photoUrl,
          },
        });
        const options = await this.prismaService.option.findMany({
          where: {
            surveyQuestionId: question.id,
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
              },
            });
          }
        }

        const newOptions =
          found.options
            ?.filter((o) => !o.id)
            .map((o) => ({
              value: o.value,
            })) || [];

        if (newOptions.length > 0) {
          await this.prismaService.option.createMany({
            data: newOptions.map((o) => ({
              surveyQuestionId: question.id,
              ...o,
            })),
          });
        }
      }
    }

    const newQuestions = data.surveyQuestions
      .filter((q) => !q.id)
      .map((question) =>
        this.prismaService.surveyQuestion.create({
          data: {
            label: question.label,
            type: question.type,
            order: question.order,
            description: question.description,
            maxLength: question.maxLength,
            maxNumber: question.maxNumber,
            minNumber: question.minNumber,
            scaleDots: question.scaleDots,
            scaleStart: question.scaleStart,
            scaleEnd: question.scaleEnd,
            allowDecimal: question.allowDecimal,
            required: question.required,
            photoUrl: question.photoUrl,
            Survey: {
              connect: {
                id: updatedSurvey.id,
              },
            },
            ...(question.options
              ? {
                  options: {
                    createMany: {
                      data: question.options.map((option) => ({
                        value: option.value,
                      })),
                    },
                  },
                }
              : {}),
          },
        }),
      );

    await Promise.all(newQuestions);
    return updatedSurvey;
  }

  async getSurveyAdmin(id: number, sessionInfo: GetSessionInfoDto) {
    await this.checkAccess(sessionInfo);

    const survey = await this.prismaService.survey.findUnique({
      where: {
        id,
        archived: false,
      },
      include: {
        surveyQuestions: {
          where: {
            archived: false,
          },
          orderBy: {
            order: 'asc',
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

    if (!survey) throw new NotFoundException('Опрос не найден');

    return survey;
  }

  async getAssignedSurveys(sessionInfo: GetSessionInfoDto) {
    return (
      await this.prismaService.user_Assigned_Survey.findMany({
        where: {
          userId: sessionInfo.id,
          finished: false,
          AND: [
            {
              OR: [
                {
                  availableFrom: {
                    lte: new Date(new Date().setHours(0, 0, 0, 0)),
                  },
                },
                {
                  availableFrom: null,
                },
              ],
            },
            {
              OR: [
                {
                  endDate: {
                    gte: new Date(),
                  },
                },
                {
                  endDate: null,
                },
              ],
            },
          ],
          survey: {
            hidden: false,
            archived: false,
          },
        },
        include: {
          survey: {
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
        !test.survey.startDate ||
        test.survey.startDate <= new Date(new Date().setHours(23, 59, 59, 999)),
    );
  }

  async answerQuestion(
    assignedId: number,
    sessionInfo: GetSessionInfoDto,
    answer: AnswerQuestionDTO,
    file?: Express.Multer.File,
  ) {
    const survey = await this.prismaService.user_Assigned_Survey.findFirst({
      where: {
        id: assignedId,
        userId: sessionInfo.id,
      },
    });

    if (!survey) {
      throw new NotFoundException();
    }

    const question = await this.prismaService.surveyQuestion.findFirst({
      where: {
        id: answer.questionId,
      },
      include: {
        answeredQuestions: {
          where: {
            userId: sessionInfo.id,
            assignedSurveyId: assignedId,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException();
    }

    const dataToSet: Pick<
      Prisma.UserAnsweredQuestionCreateInput,
      | 'numberAnswer'
      | 'options'
      | 'textAnswer'
      | 'dateAnswer'
      | 'phoneAnswer'
      | 'timeAnswer'
      | 'scaleAnswer'
      | 'fileAnswer'
    > = {};

    if (question.type === 'TEXT') {
      dataToSet.textAnswer = answer.textAnswer;
    } else if (question.type === 'NUMBER') {
      dataToSet.numberAnswer = answer.numberAnswer;
    } else if (question.type === 'DATE') {
      dataToSet.dateAnswer = new Date(answer.dateAnswer);
    } else if (question.type === 'PHONE') {
      dataToSet.phoneAnswer = answer.phoneAnswer;
    } else if (question.type === 'TIME') {
      dataToSet.timeAnswer = answer.timeAnswer;
    } else if (question.type === 'SCALE') {
      dataToSet.scaleAnswer = answer.scaleAnswer;
    } else if (question.type === 'FILE') {
      if (question.answeredQuestions.length > 0) {
        const findFile = question.answeredQuestions.find((a) => a.fileAnswer);
        if (findFile) {
          await this.filesService.deleteFile(findFile.fileAnswer);
        }
      }
      const uploaded = await this.filesService.uploadFile(
        file,
        'SURVEY_ANSWER/' + answer.questionId,
      );
      dataToSet.fileAnswer = uploaded;
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
          surveyQuestionId: answer.questionId,
          assignedSurveyId: assignedId,
        },
      },
    );

    if (!foundAnswer) {
      return await this.prismaService.userAnsweredQuestion.create({
        data: {
          ...dataToSet,
          assignedSurveyId: assignedId,
          surveyQuestionId: answer.questionId,
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

  async getAssignedSurvey(surveyId: number, sessionInfo: GetSessionInfoDto) {
    const survey = await this.prismaService.user_Assigned_Survey.findFirst({
      where: {
        id: surveyId,
        userId: sessionInfo.id,
        AND: [
          {
            OR: [
              {
                availableFrom: {
                  lte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
              },
              {
                availableFrom: null,
              },
            ],
          },
          {
            OR: [
              {
                endDate: {
                  gte: new Date(),
                },
              },
              {
                endDate: null,
              },
            ],
          },
        ],
        survey: {
          archived: false,
          hidden: false,
        },
        finished: false,
      },
      include: {
        survey: {
          include: {
            surveyQuestions: {
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
                scaleDots: true,
                scaleEnd: true,
                scaleStart: true,
                order: true,
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
              orderBy: {
                order: 'asc',
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

    if (!survey) {
      throw new NotFoundException('Опрос не найден');
    }

    return survey;
  }

  async startAssesment(surveyId: number, sessionInfo: GetSessionInfoDto) {
    const survey = await this.prismaService.user_Assigned_Survey.findFirst({
      where: {
        user: {
          id: sessionInfo.id,
        },
        id: surveyId,
        finished: false,
      },
    });

    if (!survey) {
      throw new NotFoundException();
    }

    if (survey.startDate) {
      return survey;
    }

    return await this.prismaService.user_Assigned_Survey.update({
      where: {
        id: survey.id,
      },
      data: {
        startDate: new Date(),
      },
    });
  }

  async finishSurvey(assignedId: number, sessionInfo: GetSessionInfoDto) {
    return await this.prismaService.user_Assigned_Survey.update({
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

  async getUserFinishedSurveyById(
    surveyId: number,
    sessionInfo: GetSessionInfoDto,
  ) {
    const survey = await this.prismaService.user_Assigned_Survey.findFirst({
      where: {
        id: surveyId,
        userId: sessionInfo.id,
        finished: true,
      },
      include: {
        survey: true,
      },
    });
    if (!survey) {
      throw new NotFoundException('Опрос не найден');
    }
    return survey;
  }

  async getFinishedSurveys(sessionInfo: GetSessionInfoDto) {
    const finishedSurveys =
      await this.prismaService.user_Assigned_Survey.findMany({
        where: {
          userId: sessionInfo.id,
          finished: true,
        },
        include: {
          survey: true,
        },
        orderBy: {
          id: 'desc',
        },
      });
    return finishedSurveys;
  }

  async getResultSurvey(id: number, sessionInfo: GetSessionInfoDto) {
    await this.checkAccess(sessionInfo);

    const survey = await this.prismaService.survey.findFirst({
      where: {
        id,
        archived: false,
      },
      include: {
        usersAssigned: {
          select: {
            finished: true,
            endDate: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        surveyQuestions: {
          where: {
            archived: false,
          },
          orderBy: {
            order: 'asc',
          },
          include: {
            options: {
              where: {
                archived: false,
              },
            },
            answeredQuestions: {
              include: {
                user: {
                  select: {
                    username: true,
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
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
    });

    if (!survey) throw new NotFoundException('Опрос не найден');
    if (survey.anonymous) {
      survey.surveyQuestions.forEach((question) => {
        question.answeredQuestions.forEach((answer) => {
          answer.user = {
            id: undefined,
            username: undefined,
            firstName: undefined,
            lastName: undefined,
          };
        });
      });
      survey.usersAssigned.forEach((user) => {
        user.user = {
          id: undefined,
          username: undefined,
          firstName: undefined,
          lastName: undefined,
        };
      });
    }

    return survey;
  }
}
