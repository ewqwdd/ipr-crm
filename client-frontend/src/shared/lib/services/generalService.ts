export const generalService = {
  /**
   * Преобразует относительный путь к файлу в полный URL,
   */
  transformFileUrl: (url?: string): string | undefined => {
    if (!url) {
      return undefined;
    }
    return import.meta.env.VITE_FILES_URL + url;
  },
};
