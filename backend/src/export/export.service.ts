import { Injectable } from '@nestjs/common';
import { Rate360 } from '@prisma/client';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import {
  ExportCaseRatesPayload,
  ExportIprPayload,
  ExportRatesPayload,
} from './export.types';

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

  async exportCases(res: Response, data: ExportCaseRatesPayload) {
    const keys = ['username', 'case', 'rate', 'comment'] as const;

    const caseRates = data.cases.map((caseRate) => {
      const userRates = data.userRates
        .filter((userRate) => userRate.caseId === caseRate.id)
        .sort((a, b) => b.userId - a.userId);

      return userRates.map((userRate) => ({
        username: userRate.user.username,
        case: caseRate.name,
        rate: userRate.rate,
        comment: userRate.comment,
      }));
    });

    console.log(caseRates);

    await this.excelService.generateExcel<typeof keys>(res, {
      keys,
      headers: {
        username: 'Никнейм',
        case: 'Кейс',
        rate: 'Оценка',
        comment: 'Комментарий',
      },
      name: `${data.user.username} - Кейсы`,
      rows: [
        ...caseRates
          .filter((caseRate) => caseRate.length > 0)
          .flatMap((caseRate) => [
            ...caseRate,
            {
              username: 'Средняя оценка',
              case: caseRate[0].case,
              rate: (
                caseRate.reduce((acc, rate) => acc + rate.rate, 0) /
                caseRate.length
              ).toFixed(1),
              comment: '',
            },
          ]),
        ...(data.comments.length > 0
          ? [
              {
                username: 'Комментарии',
                case: '',
                rate: '',
                comment: '',
              },
            ]
          : []),
        ...data.comments.map((comment) => ({
          username: comment.user.username,
          case: '',
          rate: '',
          comment: comment.comment,
        })),
        {
          username: 'Общая оценка',
          case: '',
          rate: (
            data.userRates.reduce((acc, rate) => acc + rate.rate, 0) /
            data.userRates.length
          ).toFixed(1),
          comment: '',
        },
      ],
    });
  }
}
