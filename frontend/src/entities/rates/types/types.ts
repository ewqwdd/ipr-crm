export interface Rate {
  id: number;
}

export type EvaluateUser = { userId: number; username?: string };

export type EvaulatorType = 'curator' | 'team' | 'subbordinate';

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
