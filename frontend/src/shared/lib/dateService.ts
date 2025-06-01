export const dateService = {
  formatDate: (date: string | Date): string => {
    const d = new Date(date);

    return new Intl.DateTimeFormat('ru-RU').format(d);
  },
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
  formatTime: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return dateObj.toLocaleString('ru-RU', options);
  },
  normalizeStartDate: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj.toISOString();
  },
  normalizeEndDate: (date?: string | Date): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj.toISOString();
  },
};
