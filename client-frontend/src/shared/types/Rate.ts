import type { Ipr } from "./Ipr";
import type { Material } from "./Material";
import type { User } from "./User";

export type SkillType = "SOFT" | "HARD";

export interface Hints {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
}

export interface HintValues {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
  4?: string;
  5?: string;
}

export interface Competency {
  id: number;
  name: string;
  blockId: number;
  indicators: Indicator[];
  materials: { material: Material }[];
  archived?: boolean;
}

export interface Indicator {
  id: number;
  name: string;
  description?: string;
  competencyId: number;
  materials: { material: Material }[];
  boundary: number;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  hint4?: string;
  hint5?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  value5?: string;
  skipHint?: string;
  skipValue?: string;
  archived?: boolean;
}

export interface CompetencyBlock {
  id: number;
  name: string;
  type: SkillType;
  materials?: { material: Material }[];
  competencies: Competency[];
  archived?: boolean;
}

type RateEvaluator = {
  userId: number;
  type: EvaulatorType;
  user: {
    username: string;
    avatar?: string;
  };
};

export interface Rate {
  id: number;
  userConfirmed: boolean;
  curatorConfirmed: boolean;
  startDate: string | null;
  endDate: string | null;
  userId: number;
  specId: number;
  teamId?: number;
  archived: boolean;
  showReportToUser?: boolean;
  type: "HARD" | "SOFT";
  evaluators: RateEvaluator[];
  user: Pick<User, "id" | "username" | "avatar" | "firstName" | "lastName">;
  spec: { id: number; name: string };
  team?: {
    id: number;
    name: string;
    curator: { id: number; username: string; avatar?: string };
  };
  userComment?: string;
  curatorComment?: string;
  userRates: {
    id: number;
    userId: number;
    rate360Id: number;
    rate: number;
    indicatorId: number;
    comment?: string;
    approved: boolean;
    createdAt: string;
  }[];
  comments: {
    id: number;
    userId: number;
    rate360Id: number;
    comment: string;
    competencyId: number;
  }[];
  plan?: Ipr;
  competencyBlocks: CompetencyBlock[];
  rateType: "Rate180" | "Rate360";
  finished: boolean;
}
export type EvaluateUser = { userId: number; username?: string };

export type EvaulatorType = "CURATOR" | "TEAM_MEMBER" | "SUBORDINATE";
