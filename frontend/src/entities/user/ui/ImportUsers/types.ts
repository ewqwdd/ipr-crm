export interface ImportUsersRowType {
  Департамент: string;
  Направление: string;
  Ник: string;
  Почта: string;
}

export type ImportUsersStateType = {
  data: ImportUsersRowType[];
  specs: string[];
  teams: string[];
} | null;

export interface ImportMultipleUser {
  username: string;
  email: string;
  spec?: string;
  team?: string;
}
