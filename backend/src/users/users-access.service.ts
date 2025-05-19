import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';

type SubTeam = {
  id: number;
  subTeams?: SubTeam[];
  curatorId?: number;
};

@Injectable()
export class UsersAccessService {
  constructor(private prisma: PrismaService) {}

  findSubTeams = (teams: SubTeam[] = []) => {
    const filterTeam = (team: SubTeam) => {
      const allSubTeams =
        team.subTeams?.flatMap((subTeam) => filterTeam(subTeam)) ?? [];
      return [team, ...allSubTeams];
    };

    return teams.flatMap((team) => filterTeam(team)).filter((t) => t !== null);
  };

  async findAllowedTeams(userId: number): Promise<number[]> {
    const curatorTeams = await this.prisma.team.findMany({
      where: {
        curatorId: userId,
      },
      select: {
        id: true,
        name: true,
        subTeams: {
          select: {
            id: true,
            name: true,
            subTeams: {
              select: {
                id: true,
                name: true,
                subTeams: {
                  select: {
                    id: true,
                    name: true,
                    subTeams: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const allTeams = this.findSubTeams(curatorTeams);
    const allowedTeamIds = allTeams.map((team) => team.id);
    return allowedTeamIds;
  }

  async findAllowedSubbordinates(
    userId: number,
  ): Promise<{ teamId: number; userId: number }[]> {
    const teams = await this.prisma.team.findMany({
      where: {
        curatorId: userId,
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
        subTeams: {
          select: {
            curatorId: true,
            id: true,
          },
        },
      },
    });
    return teams.flatMap((team) => {
      const users = team.users.map((user) => ({
        userId: user.userId,
        teamId: team.id,
      }));

      return [
        ...users,
        ...(team.curatorId
          ? [{ userId: team.curatorId, teamId: team.id }] : []),
        ...team.subTeams.map((subTeam) => ({
          userId: subTeam.curatorId,
          teamId: subTeam.id,
        })),
      ];
    });
  }
}
