export interface ProfileConstructorFolderProduct {
  id: number;
  name: string;
  createdAt: string;
  teams?: ProfileConstructorFolderTeam[];
}

export interface ProfileConstructorFolderTeam {
  id: number;
  name: string;
  productId: number;
  createdAt: string;
  specs?: ProfileConstructorFolderSpec[];
}

export interface ProfileConstructorFolderSpec {
  id: number;
  name: string;
  teamId: number;
  createdAt: string;
  competencyBlocks?: { id: number; name: string }[];
}

export interface CreateProductFolderDto {
  name: string;
}

export interface UpdateProductFolderDto {
  name: string;
}

export interface CreateTeamFolderDto {
  name: string;
  productId: number;
}

export interface UpdateTeamFolderDto {
  name: string;
}

export interface CreateSpecFolderDto {
  specs: string[];
  teamId: number;
}

export interface UpdateSpecFolderDto {
  name: string;
}

export enum FolderType {
  PRODUCT = 'PRODUCT',
  TEAM = 'TEAM',
  SPEC = 'SPEC',
}
