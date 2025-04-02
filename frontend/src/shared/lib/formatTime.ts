export const formatTime = (date?: string | Date): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return dateObj.toLocaleString('ru-RU', options);
};
