type RateEveloper = {
  userId: number;
  type: EvaulatorType;
  user: {
    username: string;
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
  teamId: number;
  archived: boolean;
  type: 'HARD' | 'SOFT';
  evaluators: RateEveloper[];
  user: { id: number; username: string };
  spec: { id: number; name: string };
  team: { id: number; name: string };
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
}
export type EvaluateUser = { userId: number; username?: string };

export type EvaulatorType = 'CURATOR' | 'TEAM_MEMBER' | 'SUBORDINATE';

export type AddRateDto = {
  teamId: number;
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
}
