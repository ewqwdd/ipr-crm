import { NotificationType } from '@/entities/notifications';
import { MultiValue } from 'react-select';

type IdName = { id: number; name: string };
export type Role = IdName;
export type Spec = IdName & {
  competencyBlocks: { id: number; name: string }[];
  materials?: { id: number }[];
  description?: string;
  active?: boolean;
};

export interface Notification {
  id: number;
  userId: number;
  title: string;
  description?: string;
  date: string;
  watched: boolean;
  type: NotificationType;
  url?: string;
  rateId?: number;
  iprId?: number;
}
export interface User {
  id: number;
  email: string;
  username: string;
  role: Role;
  avatar?: string;
  Spec?: Spec;
  firstName: string;
  lastName: string;
  phone?: string;
  teams?: { teamId: number; team: { name: string } }[];
  teamCurator?: { id: number; name: string }[];
  notifications: Notification[];
  access?: boolean;
  specsOnTeams?: { spec: { id: number; name: string } }[];
  deputyRelationsAsDeputy: {
    user: DeputyUser;
  }[];
  deputyRelationsAsUser: {
    deputy: DeputyUser;
  }[];
}

export interface UserStoreSchema {
  user: (User & { teamAccess: number[]; userAccess: number[] }) | null;
  isMounted: boolean;
  isAdmin: boolean;
}

export type DeputyUser = { id: number; username: string; avatar?: string };

export interface UserFormData {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId?: number;
  specId?: number;
  avatar?: File;
  teams?: MultiValue<{ value: number; label: string }>;
}

export interface UsersFilter {
  user?: number;
  teams: {
    product?: number;
    department?: number;
    direction?: number;
    group?: number;
  };
  access: 'ALL' | 'ACTIVE' | 'INACTIVE';
  page: number;
}
