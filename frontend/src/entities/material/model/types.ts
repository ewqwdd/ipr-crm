export const materialTypes = {
  VIDEO: 'Видео',
  BOOK: 'Книга',
  COURSE: 'Курс',
  ARTICLE: 'Статья',
  TASK: 'Задание',
};

export type MaterialType = keyof typeof materialTypes;

export interface Material {
  id: number;
  name: string;
  description?: string;
  contentType: MaterialType;
  url: string;
  level: number;
  competencyId?: number;
  indicatorId?: number;
}
