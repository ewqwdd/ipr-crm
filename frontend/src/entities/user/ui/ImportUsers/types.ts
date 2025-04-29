export interface ImportUsersRowType {
  Департамент: string;
  Направление: string;
  Группа?: string;
  Продукт: string;
  Ник: string;
  Почта: string;
  Лидер?: string;
}

export type ImportUsersStateType = {
  data: ImportUsersRowType[];
  products: string[];
  departments: string[];
  directions: string[];
  groups: string[];
} | null;

export interface ImportMultipleUser {
  username: string;
  email: string;
  group?: string;
  department?: string;
  direction?: string;
  product?: string;
  leader?: boolean;
}
