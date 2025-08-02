import { type Notification } from "./Notification";

type IdName = { id: number; name: string };
export type Role = IdName;
export type Spec = IdName & {
  competencyBlocks: { id: number; name: string }[];
  materials?: { id: number }[];
  description?: string;
  active?: boolean;
};

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
  access?: boolean;
  specsOnTeams?: { spec: { id: number; name: string } }[];
  deputyRelationsAsDeputy: {
    user: DeputyUser;
  }[];
  deputyRelationsAsUser: {
    deputy: DeputyUser;
  }[];
}

export type DeputyUser = { id: number; username: string; avatar?: string };

export interface UserFormData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  specId?: number;
  avatar?: File;
}
