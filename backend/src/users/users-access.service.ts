import { Injectable } from '@nestjs/common';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { PrismaService } from 'src/utils/db/prisma.service';
import { RedisService } from 'src/utils/redis/redis.service';

type SubTeam = {
  id: number;
  subTeams?: SubTeam[];
  curatorId?: number;
};

@Injectable()
export class UsersAccessService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  cacheTime = 60 * 5; // 5 minutes in seconds

  findSubTeams = (teams: SubTeam[] = []) => {
    const filterTeam = (team: SubTeam) => {
      const allSubTeams =
        team.subTeams?.flatMap((subTeam) => filterTeam(subTeam)) ?? [];
      return [team, ...allSubTeams];
    };

    return teams.flatMap((team) => filterTeam(team)).filter((t) => t !== null);
  };

  getRedisTeamsKey = (userId: number) => `allowedTeams:${userId}`;
  getRedisSubordinatesKey = (userId: number) => `allowedSubordinates:${userId}`;

  async findAllowedTeams(
    { role, id }: GetSessionInfoDto,
    rewriteCache?: boolean,
  ): Promise<number[]> {
    if (role === 'admin') {
      return this.prisma.team
        .findMany({
          select: {
            id: true,
          },
        })
        .then((teams) => teams.map((team) => team.id));
    }

    if (!rewriteCache) {
      const cachedTeams = await this.redis.get(this.getRedisTeamsKey(id));
      if (cachedTeams) {
        return JSON.parse(cachedTeams) as number[];
      }
    }

    const curatorTeams = await this.prisma.team.findMany({
      where: {
        curatorId: id,
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
    await this.redis.setex(
      this.getRedisTeamsKey(id),
      this.cacheTime,
      JSON.stringify(allowedTeamIds),
    );
    return allowedTeamIds;
  }

  async removeRedisTeamsCache(userId: number): Promise<void> {
    const redisTeamKey = this.getRedisTeamsKey(userId);
    const redisSubordinatesKey = this.getRedisSubordinatesKey(userId);
    await this.redis.del(redisTeamKey).catch((error) => {
      console.error(`Failed to delete Redis key ${redisTeamKey}:`, error);
    });
    await this.redis.del(redisSubordinatesKey).catch((error) => {
      console.error(
        `Failed to delete Redis key ${redisSubordinatesKey}:`,
        error,
      );
    });
  }

  async asyncRemoveRedisSubordinatesCache(userId: number): Promise<void> {
    const redisSubordinatesKey = this.getRedisSubordinatesKey(userId);
    await this.redis.del(redisSubordinatesKey).catch((error) => {
      console.error(
        `Failed to delete Redis key ${redisSubordinatesKey}:`,
        error,
      );
    });
  }

  async findAllowedSubbordinatesWithTeams(
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
          ? [{ userId: team.curatorId, teamId: team.id }]
          : []),
        ...team.subTeams
          .map((subTeam) => ({
            userId: subTeam.curatorId,
            teamId: subTeam.id,
          }))
          .filter((subTeam) => subTeam.userId !== null),
      ];
    });
  }

  async findAllowedSubbordinates(
    userId: number,
    rewriteCache?: boolean,
  ): Promise<number[]> {
    if (!rewriteCache) {
      const cachedSubordinates = await this.redis.get(
        this.getRedisSubordinatesKey(userId),
      );
      if (cachedSubordinates) {
        return JSON.parse(cachedSubordinates) as number[];
      }
    }
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
          },
        },
      },
    });

    const subordinates = new Set<number>();
    teams.forEach((team) => {
      team.users.forEach((user) => subordinates.add(user.userId));
      if (team.curatorId) {
        subordinates.add(team.curatorId);
      }
      team.subTeams.forEach((subTeam) => {
        if (subTeam.curatorId) {
          subordinates.add(subTeam.curatorId);
        }
      });
    });
    await this.redis.setex(
      this.getRedisSubordinatesKey(userId),
      this.cacheTime,
      JSON.stringify(Array.from(subordinates)),
    );

    return Array.from(subordinates);
  }
}
