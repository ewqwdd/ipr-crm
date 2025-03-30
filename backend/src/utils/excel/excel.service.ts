import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

interface ExcelData<T extends string[]> {
  name: string;
  headers: Record<T[number], string>;
  keys: T;
  rows: Record<T[number], string | number>[];
}

@Injectable()
export class ExcelService {
  async generateExcel<T extends string[]>(res: Response, data: ExcelData<T>) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(data.name);

    // Пример данных
    worksheet.columns = data.keys.map((key) => ({
      header: data.headers[key],
      key: key,
      width: 20,
    }));

    data.rows.forEach((row) => {
      worksheet.addRow(row);
    });

    // Установка заголовков для скачивания
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    // Записываем в поток и отправляем
    await workbook.xlsx.write(res);
    res.end();
  }
}
