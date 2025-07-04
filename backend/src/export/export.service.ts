import { Injectable } from '@nestjs/common';
import { Rate360 } from '@prisma/client';
import { PrismaService } from 'src/utils/db/prisma.service';
import { ExcelService } from './excel.service';
import { Response } from 'express';

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
    rates: (Rate360 & { user: { username: string }; progress: number })[],
  ) {
    const keys = ['username', 'progress'];

    await this.excelService.generateExcel(res, {
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
}
