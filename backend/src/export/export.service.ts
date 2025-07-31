import { Injectable } from '@nestjs/common';
import { Rate360 } from '@prisma/client';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import { ExportIprPayload, ExportRatesPayload } from './export.types';

@Injectable()
export class ExportService {
  constructor(private readonly excelService: ExcelService) {}

  async ratesConfirm(
    res: Response,
    rates: (Rate360 & { user: { username: string } })[],
  ) {
    const keys = ['username', 'userConfirmed', 'curatorConfirmed'];

    await this.excelService.generateExcel(res, {
      keys,
      headers: {
        username: 'Никнейм',
        userConfirmed: 'Утвержден пользователем',
        curatorConfirmed: 'Утвержден руководителем',
      },
      name: '360 статистика',
      rows: rates.map((rate) => ({
        username: rate.user.username,
        userConfirmed: rate.userConfirmed ? 'Да' : 'Нет',
        curatorConfirmed: rate.curatorConfirmed ? 'Да' : 'Нет',
      })),
    });
  }

  async exportRates(res: Response, rates: ExportRatesPayload) {
    const keys = ['index', 'username', 'type', 'progress'] as const;

    await this.excelService.generateExcel<typeof keys>(res, {
      keys,
      headers: {
        index: '',
        username: 'Никнейм',
        type: 'Тип',
        progress: 'Прогресс',
      },
      name: '360 оценки',
      rows: rates.map((rate, i) => ({
        index: i + 1,
        username: rate.user.username,
        type: rate.type,
        progress: `${(Math.min(rate.progress, 1) * 100).toFixed()}%`,
      })),
    });
  }

  async exportIprs(res: Response, plans: ExportIprPayload) {
    const keys = ['index', 'username', 'deputy', 'team', 'progress'] as const;

    await this.excelService.generateExcel(res, {
      keys,
      headers: {
        index: '',
        username: 'Никнейм',
        deputy: 'Заместитель у',
        team: 'Команда',
        progress: 'Прогресс',
      },
      name: 'Планы развития',
      rows: plans.map((plan, i) => ({
        index: i + 1,
        username: plan.user.username,
        deputy: plan.user.deputyRelationsAsDeputy
          .map((deputy) => deputy.user.username)
          .join(', '),
        team: plan.rate360?.team?.name,
        progress:
          plan.tasks.filter((task) => !!task.onBoard).length > 0
            ? (
                (plan.tasks.filter(
                  (task) => task.status === 'COMPLETED' && !!task.onBoard,
                ).length /
                  plan.tasks.filter((task) => !!task.onBoard).length) *
                100
              ).toFixed(0) + '%'
            : '100%',
      })),
    });
  }
}
