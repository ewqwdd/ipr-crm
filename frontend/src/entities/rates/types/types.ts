import { Ipr } from '@/entities/ipr';
import { CompetencyBlock } from '@/entities/skill';
import { TeamItemIds } from '../ui/AddRate/EvaluatorsTab/EvaluatorsTab';
import {
  AssesmentBaseType,
  EvaulatorType,
} from '@/shared/types/AssesmentBaseType';

export type Rate = AssesmentBaseType & {
  userConfirmed: boolean;
  curatorConfirmed: boolean;
  specId: number;
  spec: { id: number; name: string };
  showReportToUser?: boolean;
  type: 'HARD' | 'SOFT';
  userComment?: string;
  curatorComment?: string;
  userRates: {
    id: number;
    userId: number;
    rate360Id: number;
    rate: number;
    indicatorId: number;
    approved: boolean;
    createdAt: string;
  }[];
  plan?: Ipr;
  competencyBlocks: CompetencyBlock[];
  rateType: 'Rate180' | 'Rate360';
};

export type EvaluateUser = { userId: number; username?: string };

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
      team?: {
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
