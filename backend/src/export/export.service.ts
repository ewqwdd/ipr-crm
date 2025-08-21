import { Injectable } from '@nestjs/common';
import { Rate360 } from '@prisma/client';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import {
  ExportCaseRatesPayload,
  ExportIprPayload,
  ExportRatesPayload,
  ExportTeamsPayload,
} from './export.types';

@Injectable()
export class ExportService {
  constructor(private readonly excelService: ExcelService) {}

  dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

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

  async exportRates(
    res: Response,
    rates: ExportRatesPayload,
    teams: ExportTeamsPayload,
  ) {
    const keys = [
      'index',
      'username',
      'type',
      'progress',
      'meetDate',
      'product',
      'department',
      'direction',
      'group',
    ] as const;

    const recurTeam = (team: ExportTeamsPayload[0]): string[] => {
      if (!team.parentTeam) return [team.name];
      return [team.name, ...recurTeam(team.parentTeam)];
    };

    const getTeams = (rate: ExportRatesPayload[0]) => {
      const foundTeam = teams.find((team) => team.id === rate.teamId);
      if (!foundTeam)
        return {
          product: '',
          department: '',
          direction: '',
          group: '',
        };

      const teamsArr = recurTeam(foundTeam);
      teamsArr.reverse();
      return {
        product: teamsArr[0] ?? '',
        department: teamsArr[1] ?? '',
        direction: teamsArr[2] ?? '',
        group: teamsArr[3] ?? '',
      };
    };

    await this.excelService.generateExcel<typeof keys>(res, {
      keys,
      headers: {
        index: '',
        username: 'Никнейм',
        type: 'Тип',
        progress: 'Прогресс',
        meetDate: 'Дата встречи',
        product: 'Продукт',
        department: 'Департамент',
        direction: 'Направление',
        group: 'Группа',
      },
      name: '360 оценки',
      rows: rates.map((rate, i) => ({
        index: i + 1,
        username: rate.user.username,
        type: rate.type,
        progress: `${(Math.min(rate.progress, 1) * 100).toFixed()}%`,
        meetDate: rate?.meetDate?.toLocaleString('ru-RU', this.dateOptions),
        ...getTeams(rate),
      })),
    });
  }

  async exportIprs(res: Response, plans: ExportIprPayload) {
    const keys = [
      'index',
      'curator',
      'deputy',
      'username',
      'team',
      'progress',
      'meetDate',
      'link',
    ] as const;

    await this.excelService.generateExcel(res, {
      keys,
      headers: {
        index: '',
        curator: 'Руководитель',
        deputy: 'Заместитель у',
        username: 'Никнейм',
        team: 'Команда',
        progress: 'Прогресс',
        meetDate: 'Дата встречи',
        link: 'Ссылка',
      },
      name: 'Планы развития',
      rows: plans.map((plan, i) => ({
        index: i + 1,
        username: plan.user.username,
        curator: plan.planCurators
          .map((curator) => curator.user.username)
          .join(', '),
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
        meetDate: plan.rate360?.meetDate?.toLocaleString(
          'ru-RU',
          this.dateOptions,
        ),
        link: `${process.env.FRONTEND_URL}/ipr/360/${plan.id}`,
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
