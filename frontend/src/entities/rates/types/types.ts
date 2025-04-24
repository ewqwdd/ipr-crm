import { Ipr } from '@/entities/ipr';
import { CompetencyBlock } from '@/entities/skill';
import { User } from '@/entities/user';
import { TeamItemIds } from '../ui/AddRate/EvaluatorsTab/EvaluatorsTab';

type RateEveloper = {
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
  type: 'HARD' | 'SOFT';
  evaluators: RateEveloper[];
  user: User;
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
  rateType: 'Rate180' | 'Rate360';
  finished: boolean;
}
export type EvaluateUser = { userId: number; username?: string };

export type EvaulatorType = 'CURATOR' | 'TEAM_MEMBER' | 'SUBORDINATE';

export type AddRateDto = {
  teamId?: number;
  specs: {
    specId: number;
    userId: number;
    evaluateCurators: EvaluateUser[];
    evaluateTeam: EvaluateUser[];
    evaluateSubbordinate: EvaluateUser[];
  }[];
};

export interface RateStoreSchema {
  selectedSpecs: AddRateDto[];
  confirmUser: boolean;
  confirmCurator: boolean;
  editEvaluators?: TeamItemIds;
}
