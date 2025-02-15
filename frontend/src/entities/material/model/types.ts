export const materialTypes = {
  VIDEO: 'Видео',
  BOOK: 'Кнгига',
  COURSE: 'Курс',
  ARTICLE: 'Статья',
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
