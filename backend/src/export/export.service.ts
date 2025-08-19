import { Injectable } from '@nestjs/common';
import { Rate360 } from '@prisma/client';
import { ExcelService } from './excel.service';
import { Response } from 'express';
import {
  ExportIprPayload,
  ExportRatesPayload,
  ExportTeamsPayload,
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
        ...getTeams(rate),
      })),
    });
  }

  async exportIprs(res: Response, plans: ExportIprPayload) {
    const keys = [
      'index',
      'username',
      'deputy',
      'team',
      'progress',
      'meetDate',
    ] as const;

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    await this.excelService.generateExcel(res, {
      keys,
      headers: {
        index: '',
        username: 'Никнейм',
        deputy: 'Заместитель у',
        team: 'Команда',
        progress: 'Прогресс',
        meetDate: 'Дата встречи',
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
        meetDate: plan.rate360?.meetDate?.toLocaleString('ru-RU', options),
      })),
    });
  }
}
