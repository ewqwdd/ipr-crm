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

    worksheet.columns = data.keys.map((key) => ({
      header: data.headers[key],
      key: key,
      width: 20,
    }));

    data.rows.forEach((row) => {
      worksheet.addRow(row);
    });

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFDDDD' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    headerRow.commit();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(data.name)}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
