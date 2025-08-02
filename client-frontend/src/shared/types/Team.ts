import type { DeputyUser } from "./User";

export type SpecOnUser = {
  specId: number;
  spec: { name: string; active?: boolean };
  teamId?: number;
};

export const teamTypes = [
  "PRODUCT",
  "DEPARTMENT",
  "DIRECTION",
  "GROUP",
] as const;

export type TeamType = (typeof teamTypes)[number];

export const teamTypeNames: Record<TeamType, string> = {
  PRODUCT: "Продукт",
  DEPARTMENT: "Департамент",
  DIRECTION: "Направление",
  GROUP: "Группа",
};

export type TeamUser = {
  id: number;
  username: string;
  avatar?: string;
  specsOnTeams?: SpecOnUser[];
  deputyRelationsAsDeputy: {
    user: DeputyUser;
  }[];
};

export interface Team {
  id: number;
  name: string;
  description?: string;
  parentTeamId?: number;
  subTeams?: Team[];
  users?: { user: TeamUser }[];
  curator?: TeamUser;
  curatorSpecs: SpecOnUser[];
  type?: TeamType;
  curatorId?: number;
}
