export const dateService = {
  /**
   * @example
   * formatDate('2024-06-03') // => '03.06.2024'
   */
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ru-RU').format(d);
  },

  /**
   * @example
   * formatDateTime('2024-06-03T14:30:00Z') // => '03.06.2024, 17:30' (с учётом локального времени)
   */
  formatDateTime: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return dateObj.toLocaleString('ru-RU', options);
  },

  /**
   * @example
   * formatTime('2024-06-03T14:30:00') // => '14:30'
   */
  formatTime: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return dateObj.toLocaleString('ru-RU', options);
  },

  /**
   * @example
   * normalizeStartDate('2024-06-03T12:00:00Z') // => '2024-06-03T00:00:00.000Z'
   */
  normalizeStartDate: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj.toISOString();
  },

  /**
   * @example
   * normalizeEndDate('2024-06-03T12:00:00Z') // => '2024-06-03T23:59:59.999Z'
   */
  normalizeEndDate: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj.toISOString();
  },
};
