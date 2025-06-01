import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { MailService } from '../mailer/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { errorLogger } from '../filters/logger';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

  async getNotifications(id: number) {
    const notifications = await this.prismaService.notification.findMany({
      where: { userId: id, watched: false },
    });
    return notifications ?? [];
  }

  generateText(heading: string, message: string, link: string) {
    return `<div style="font-family:Arial,sans-serif;padding:20px;text-align: center;">
<h2 style="max-width:560px;margin:30px auto;">${heading}</h2>
<p style="max-width:560px;margin:30px auto;">${message}</p>
<a href="${link}" style="display:inline-block;margin-top:20px;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin-left:30px;">Перейти</a>
</div>`;
  }

  async sendIprAssignedNotification(userId: number, iprId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = `Вам назначен индивидуальный план развития №${iprId}`;
      const link = `${process.env.FRONTEND_URL}/board`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(
        user.email,
        'Вам назначен индивидуальный план развития',
        html,
      );
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначен индивидуальный план развития',
        userId: userId,
        type: 'IPR_ASSIGNED',
        iprId: iprId,
        url: '/board',
      },
    });
  }

  async sendRateAssignedNotification(
    userId: number,
    rateId: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    const user = await (tx ?? this.prismaService).user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = `Вам назначена оценка №${rateId}`;
      const link = `${process.env.FRONTEND_URL}/progress`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(user.email, 'Вам назначена оценка', html);
    }

    console.log(rateId);
    await (tx ?? this.prismaService).notification.create({
      data: {
        title: 'Вам назначена оценка',
        userId: userId,
        type: 'RATE_ASSIGNED',
        rateId: rateId,
        url: '/progress',
      },
    });
  }

  async sendRateSelfAssignedNotification(userId: number, rateId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = `Вам назначена оценка №${rateId}`;
      const link = `${process.env.FRONTEND_URL}/progress?tab=self-assessment`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(user.email, 'Вам назначена оценка', html);
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначена оценка',
        userId: userId,
        type: 'RATE_ASSIGNED_SELF',
        rateId: rateId,
        url: '/progress?tab=self-assessment',
      },
    });
  }

  async sendRateConfirmNotification(
    userId: number,
    rateId: number,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    try {
      const user = await (tx ?? this.prismaService).user.findUnique({
        where: {
          id: userId,
        },
      });

      if (process.env.MAIL_ENABLED === 'true') {
        const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
        const message = `Вам назначено утверждение оценки №${rateId}`;
        const link = `${process.env.FRONTEND_URL}/progress?tab=confirm-list`;

        const html = this.generateText(heading, message, link);

        await this.mailService.sendMail(
          user.email,
          'Вам назначено утверждение оценки',
          html,
        );
      }

      await (tx ?? this.prismaService).notification.create({
        data: {
          title: 'Вам назначено утверждение оценки',
          userId: userId,
          type: 'RATE_CONFIRM',
          rateId: rateId,
          url: '/progress?tab=confirm-list',
        },
      });
    } catch (error) {
      errorLogger.error('Error sending rate confirmation notification:', error);
    }
  }

  async sendTestAssignedNotification(userId: number, testAssignedId?: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = 'Вам назначен тест';
      const link = `${process.env.FRONTEND_URL}/assigned-tests?tab=tests`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(user.email, 'Вам назначен тест', html);
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначен тест',
        userId: userId,
        type: 'TEST_ASSIGNED',
        url: '/assigned-tests?tab=tests',
        ...(Number.isInteger(testAssignedId)
          ? { assignedTestId: testAssignedId }
          : {}),
      },
    });
  }

  async sendTestAssignedTimeOver(userId: number, testAssignedId?: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = 'Время для теста истекло';
      const link = `${process.env.FRONTEND_URL}/assigned-tests?tab=finished`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(
        user.email,
        'Время для теста истекло',
        html,
      );
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Время для теста истекло',
        userId: userId,
        type: 'TEST_TIME_OVER',
        url: '/assigned-tests?tab=finished',
        ...(Number.isInteger(testAssignedId)
          ? { assignedTestId: testAssignedId }
          : {}),
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'sendTestAssignedCron' })
  async sendTestAssignedCron() {
    console.log('sendTestAssignedCron started');
    const tests = await this.prismaService.user_Assigned_Test.findMany({
      where: {
        OR: [
          {
            availableFrom: null,
          },
          {
            availableFrom: {
              lte: new Date(),
            },
          },
        ],
        firstNotificationSent: false,
        test: {
          hidden: false,
          archived: false,
        },
      },
      include: {
        test: {
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    const filtered = tests.filter((test) => {
      return (
        (!test.test.startDate || test.test.startDate <= new Date()) &&
        (!test.test.endDate || test.test.endDate >= new Date())
      );
    });
    let count = 0;
    for (const test of filtered) {
      await this.prismaService.user_Assigned_Test.update({
        where: {
          id: test.id,
        },
        data: {
          firstNotificationSent: true,
        },
      });
      count++;
      await this.sendTestAssignedNotification(test.userId, test.id);
    }
    console.log(`sendTestAssignedCron ended. ${count} notifications sent`);
  }

  async readNotifications(ids: number[], userId: number) {
    await this.prismaService.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
        userId: userId,
      },
      data: {
        watched: true,
      },
    });
  }

  async sendSurveyAssignedNotification(
    userId: number,
    surveyAssignedId?: number,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = 'Вам назначен опрос';
      const link = `${process.env.FRONTEND_URL}/assigned-surveys?tab=surveys`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(user.email, 'Вам назначен опрос', html);
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначен опрос',
        userId: userId,
        type: 'SURVEY_ASSIGNED',
        url: '/assigned-surveys?tab=surveys',
        ...(Number.isInteger(surveyAssignedId)
          ? { assignedSurveyId: surveyAssignedId }
          : {}),
      },
    });
  }

  async sendSupportTicketCreatedNotification(
    ticketId: number,
    user: { id: number; firstName: string; lastName: string; email: string },
  ) {
    if (process.env.MAIL_ENABLED === 'true') {
      const heading = `Здраствуйте, ${user.firstName} ${user.lastName}.`;
      const message = 'Новое обращение в поддержку';
      const link = `${process.env.FRONTEND_URL}/support/admin`;

      const html = this.generateText(heading, message, link);

      await this.mailService.sendMail(
        user.email,
        'Новое обращение в поддержку',
        html,
      );
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Новое обращение в поддержку',
        userId: user.id,
        type: 'SUPPORT_TICKET_CREATED',
        url: '/support/admin',
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'sendSurveyAssignedCron' })
  async sendSurveyAssignedCron() {
    console.log('sendSurveyAssignedCron started');
    const tests = await this.prismaService.user_Assigned_Survey.findMany({
      where: {
        OR: [
          {
            availableFrom: null,
          },
          {
            availableFrom: {
              lte: new Date(),
            },
          },
        ],
        firstNotificationSent: false,
        survey: {
          hidden: false,
          archived: false,
        },
      },
      include: {
        survey: {
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    const filtered = tests.filter((test) => {
      return (
        (!test.survey.startDate || test.survey.startDate <= new Date()) &&
        (!test.survey.endDate || test.survey.endDate >= new Date())
      );
    });
    let count = 0;
    for (const test of filtered) {
      await this.prismaService.user_Assigned_Survey.update({
        where: {
          id: test.id,
        },
        data: {
          firstNotificationSent: true,
        },
      });
      count++;
      await this.sendSurveyAssignedNotification(test.userId, test.id);
    }
    console.log(`sendSurveyAssignedCron ended. ${count} notifications sent`);
  }
}
