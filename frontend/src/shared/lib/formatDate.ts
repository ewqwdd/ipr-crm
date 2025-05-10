export const formatDate = (date: string | Date): string => {
  const d = new Date(date);

  return new Intl.DateTimeFormat('ru-RU').format(d);
};
