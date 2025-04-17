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
  mentorId?: number;
  teamCurator?: { id: number; name: string }[];
  notifications: Notification[];
}

export interface UserStoreSchema {
  user: User | null;
  isMounted: boolean;
  isAdmin: boolean;
}

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
