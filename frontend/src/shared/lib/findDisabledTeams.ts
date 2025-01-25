import { Team } from "@/entities/team"

export const findDisabledTeams = (team: Team): number[] => {
    
    const subTeams = team.subTeams?.flatMap(e => findDisabledTeams(e)) || []
    return [...subTeams, team.id]
}