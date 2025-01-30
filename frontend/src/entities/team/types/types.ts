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

type TeamSingle = Omit<Team, 'users'> & {
  users: {
    id: number
    userId: number
    teamId: number
    user: {
      specId: number
      username: string
      avatar?: string
      specsOnTeams: { specId: number; teamId: number; userId: number }[]
    }
  }[]
}

export type { Team, CreateTeamDto, TeamSingle }
