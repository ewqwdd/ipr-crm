import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Экспортирует данные в Excel-файл
 * @param columns Массив названий колонок (['Имя', 'Возраст', ...])
 * @param rows Массив объектов, где ключи соответствуют колонкам
 * @param fileName Имя файла (по умолчанию 'export.xlsx')
 */
export function exportToExcel(
  columns: string[],
  rows: Record<string, unknown>[],
  fileName = 'export.xlsx',
) {
  const data = [columns, ...rows.map((row) => columns.map((col) => row[col]))];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
}
