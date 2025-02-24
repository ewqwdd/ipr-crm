export const checkLinkFormat = (link: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(link) ? undefined : 'Неверный формат ссылки';
};
