import { AssesmentBaseType } from '@/shared/types/AssesmentBaseType';

export interface CaseVariant {
  id: number;
  name: string;
  value: number;
  caseId: number;
  createdAt: string;
}

export interface Case {
  id: number;
  name: string;
  description?: string;
  comment?: string;
  archived?: boolean;
  createdAt: string;
  commentEnabled: boolean;
  avg?: number;

  variants: CaseVariant[];
}

export type CaseRate = AssesmentBaseType & {
  rateType: 'Case';
  userRates: {
    id: number;
    userId: number;
    rate360Id: number;
    rate: number;
    caseId: number;
    comment?: string;
    approved: boolean;
    createdAt: string;
    user?: {
      id: number;
      username: string;
      avatar?: string;
    };
  }[];
  cases: Case[];
  authorId?: number;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  globalCommentsEnabled?: boolean;
};

export interface CaseCreateDto {
  name: string;
  description?: string;
  commentEnabled?: boolean;
  variants: {
    name: string;
    value: number;
  }[];
}

export interface CaseCreateRateDto {
  users: number[];
  cases: number[];
  evaluators: number[];
  globalCommentsEnabled?: boolean;
}

export interface CaseRateItemDto {
  caseId: number;
  rate: number;
  comment?: string;
}
