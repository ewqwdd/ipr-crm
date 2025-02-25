export const formatDate = (date?: string | null) => {
  if (!date) return 'Не указано';
  const updatedDate = new Date(date);
  const day = updatedDate.getDate().toString().padStart(2, '0');
  const month = (updatedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = updatedDate.getFullYear();
  return `${day}.${month}.${year}`;
};
