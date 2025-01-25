export type TeamUser = { id: number; username: string; avatar: string }

interface Team {
  id: number
  name: string
  description?: string
  parentTeamId?: number
  subTeams?: Team[]
  users?: { user: TeamUser }[]
  curator?: TeamUser
}

interface CreateTeamDto {
  name: string
  description?: string
  parentTeamId?: number
  curatorId?: number
}

export type { Team, CreateTeamDto }
