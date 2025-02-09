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
  archived: boolean;
  type: 'HARD' | 'SOFT';
  evaluators: RateEveloper[];
  user: { id: number };
  spec: { id: number };
  team: { id: number };
  userRates: any[];
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
