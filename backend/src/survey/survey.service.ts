import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateSurveyDTO } from './dto/create-survey.dto';
import { AssignUsersDTO } from './dto/assign-users.dto';
import { NotificationsService } from 'src/utils/notifications/notifications.service';

@Injectable()
export class SurveyService {
  constructor(
    private prismaService: PrismaService,
    private notificationsService: NotificationsService,
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
          order: index,
          maxLength: question.maxLength,
          maxNumber: question.maxNumber,
          minNumber: question.minNumber,
          scaleDots: question.scaleDots,
          scaleStart: question.scaleStart,
          scaleEnd: question.scaleEnd,
          archived: false,
          description: question.description,
          allowDecimal: question.allowDecimal,
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
        skipDuplicates: true, // на всякий случай
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

    const surveys = await this.prismaService.user_Assigned_Survey.findMany({
      where: {
        survey: {
          ...filters,
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
    return true;
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
      .map((question, index) =>
        this.prismaService.surveyQuestion.create({
          data: {
            label: question.label,
            type: question.type,
            order: index,
            description: question.description,
            maxLength: question.maxLength,
            maxNumber: question.maxNumber,
            minNumber: question.minNumber,
            scaleDots: question.scaleDots,
            scaleStart: question.scaleStart,
            scaleEnd: question.scaleEnd,
            allowDecimal: question.allowDecimal,
            required: question.required,
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
}
