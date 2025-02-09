import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { EvaluatorType } from '@prisma/client';

@Injectable()
export class Rate360Service {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const rates = await this.prismaService.rate360.findMany({
      include: {
        evaluators: {
          select: {
            userId: true,
            type: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
        spec: {
          select: {
            id: true,
          },
        },
        userRates: {
          include: {
            indicator: true,
          },
        },
      },
    });
    return rates;
  }

  async createRate(data: CreateRateDto) {
    const { rate, skill } = data;
    const ratesToCreate = rate.flatMap((team) => {
      return team.specs.map((spec) => ({ teamId: team.teamId, ...spec }));
    });

    const createdRates = await this.prismaService.rate360.createManyAndReturn({
      data: skill.flatMap((skill) =>
        ratesToCreate.map((rate) => ({
          type: skill,
          specId: rate.specId,
          userId: rate.userId,
        })),
      ),
    });

    return await Promise.all(
      ratesToCreate.map(async (rate, index) => {
        return await this.prismaService.rate360.update({
          where: { id: createdRates[index].id },
          data: {
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
                skipDuplicates: true,
              },
            },
          },
        });
      }),
    );
  }
}
