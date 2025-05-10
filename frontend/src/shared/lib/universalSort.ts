type UniversalType = string | number | Date;

/**
 * Универсальная функция сортировки, которая пытается сравнить значения как:
 * 1. Даты (Date, ISO-строки, строки с датой)
 * 2. Числа (в том числе строки, содержащие числа)
 * 3. Строки (любые остальные значения)
 *
 * @param a - Первое значение для сравнения (строка, число или дата)
 * @param b - Второе значение для сравнения (строка, число или дата)
 * @param order - Порядок сортировки: 'asc' для возрастания, 'desc' для убывания (по умолчанию 'asc')
 * @returns Число: отрицательное, если `a < b`, положительное, если `a > b`, 0 — если равны.
 *
 * @example
 * const items = ['2022-01-01', '2021-12-31'];
 * items.sort((a, b) => universalSort(a, b, 'asc'));
 *
 * const numbers = ['10', '2', '30'];
 * numbers.sort((a, b) => universalSort(a, b, 'desc'));
 */

export function universalSort(
  a: UniversalType,
  b: UniversalType,
  order: 'asc' | 'desc' = 'asc',
): number {
  const direction = order === 'asc' ? 1 : -1;

  const parseDate = (val: UniversalType): Date | null => {
    const d = val instanceof Date ? val : new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const dateA = parseDate(a);
  const dateB = parseDate(b);

  if (dateA && dateB) {
    return (dateA.getTime() - dateB.getTime()) * direction;
  }

  const numA = typeof a === 'number' ? a : Number(a);
  const numB = typeof b === 'number' ? b : Number(b);

  const isNumA = !isNaN(numA);
  const isNumB = !isNaN(numB);

  if (isNumA && isNumB) {
    return (numA - numB) * direction;
  }

  const strA = String(a ?? '');
  const strB = String(b ?? '');

  return strA.localeCompare(strB) * direction;
}
