import { Ipr } from '@/entities/ipr';
import { CompetencyBlock } from '@/entities/skill';
import { User } from '@/entities/user';
import { TeamItemIds } from '../ui/AddRate/EvaluatorsTab/EvaluatorsTab';

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
  type: 'HARD' | 'SOFT';
  evaluators: RateEvaluator[];
  user: Pick<User, 'id' | 'username' | 'avatar' | 'firstName' | 'lastName'>;
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

export type ChangeSpecsType = {
  teamId: number;
  specId: number;
  userId: number;
};

export interface RateEvaluatorResponse {
  avatar: string | null;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  ratesToEvaluate: {
    type: EvaulatorType;
    rate360: {
      type: 'SOFT';
      id: number;
      userId: number;
      finished: boolean;
      team: {
        id: number;
        name: string;
      };
      user: {
        id: number;
        username: string;
      };
      spec: {
        id: number;
        name: string;
        active: boolean;
        description: string | null;
        archived: boolean;
      };
      userRates: {
        rate: number;
        approved: boolean;
        userId: number;
      }[];
      competencyBlocks: {
        id: number;
        competencies: {
          id: number;
          indicators: {
            id: number;
          }[];
        }[];
      }[];
    };
  }[];
}
