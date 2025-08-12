import { User } from '@/entities/user';

type RateEvaluator = {
  userId: number;
  type: EvaulatorType;
  user: {
    username: string;
    avatar?: string;
  };
};

export interface AssesmentBaseType {
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
  comments: {
    id: number;
    userId: number;
    rate360Id: number;
    comment: string;
    competencyId?: number;
  }[];
  rateType: 'Rate180' | 'Rate360' | 'Case';
  finished: boolean;
}

export type EvaulatorType = 'CURATOR' | 'TEAM_MEMBER' | 'SUBORDINATE';
