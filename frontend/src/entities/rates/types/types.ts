export interface Rate {
  id: number;
}

export type AddRateDto = {
  teamId: number;
  specs: {
    specId: number;
    userId: number;
  }[];
};

export interface RateStoreSchema {
  selectedSpecs: AddRateDto[];
}
