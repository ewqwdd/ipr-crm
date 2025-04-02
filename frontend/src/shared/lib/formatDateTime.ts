export const formatDateTime = (date?: string | Date): string => {
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
};
