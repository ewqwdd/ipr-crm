import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { CreateTestDTO } from './dto/create-test.dto';

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

  async getTests() {
    return this.prismaService.test.findMany({
      include: {
        testQuestions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
}
