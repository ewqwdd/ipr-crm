import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { MailService } from '../mailer/mailer';

@Injectable()
export class NotificationsService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
  ) {}

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

  async sendRateAssignedNotification(userId: number, rateId: number) {
    const user = await this.prismaService.user.findUnique({
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

    await this.prismaService.notification.create({
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

  async sendRateConfirmNotification(userId: number, rateId: number) {
    const user = await this.prismaService.user.findUnique({
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

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначено утверждение оценки',
        userId: userId,
        type: 'RATE_CONFIRM',
        rateId: rateId,
        url: '/progress?tab=confirm',
      },
    });
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

      await this.mailService.sendMail(user.email, 'Вам назначена оценка', html);
    }

    await this.prismaService.notification.create({
      data: {
        title: 'Вам назначена оценка',
        userId: userId,
        type: 'TEST_ASSIGNED',
        url: '/assigned-tests?tab=tests',
        ...(Number.isInteger(testAssignedId)
          ? { assignedTestId: testAssignedId }
          : {}),
      },
    });
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
}
