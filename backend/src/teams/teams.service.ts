import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetTeamUserSpecs } from './dto/set-team-user-specs';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { Prisma } from '@prisma/client';
import { UsersAccessService } from 'src/users/users-access.service';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private usersAccessService: UsersAccessService,
  ) {}

  async create(
    name: string,
    description?: string,
    parentId?: number,
    curatorId?: number,
  ) {
    if (parentId) {
      const parentTeam = await this.prisma.team.findUnique({
        where: { id: parentId, name: name },
      });
      if (parentTeam) {
        throw new NotFoundException('Команда с таким именем уже существует.');
      }
    }

    const team = await this.prisma.team.create({
      data: {
        name,
        description,
        parentTeamId: parentId,
        curatorId,
      },
    });
    return team;
  }

  async findAll() {
    const teams = await this.prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        curatorSpecs: {
          where: { spec: { archived: false } },
          select: {
            specId: true,
            spec: { select: { name: true, active: true } },
          },
        },
        users: {
          select: {
            user: {
              select: {
                avatar: true,
                id: true,
                username: true,
                specsOnTeams: {
                  where: { spec: { archived: false } },
                  select: {
                    specId: true,
                    spec: { select: { name: true, active: true } },
                  },
                },
              },
            },
          },
        },
        curator: { select: { avatar: true, id: true, username: true } },
      },
    });
    return teams;
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        curatorSpecs: {
          where: { spec: { archived: false } },
          select: {
            specId: true,
            spec: { select: { name: true } },
          },
        },
        users: {
          select: {
            userId: true,
            teamId: true,
            user: {
              select: {
                specId: true,
                specsOnTeams: {
                  where: { teamId: id, spec: { archived: false } },
                },
                username: true,
                avatar: true,
              },
            },
          },
        },
        curator: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        subTeams: {
          select: {
            id: true,
            name: true,
            users: {
              select: {
                userId: true,
              },
            },
            curatorId: true,
          },
        },
      },
    });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }
    return team;
  }

  async joinTeam(userId: number, teamId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }
    await this.prisma.userTeam.create({ data: { userId, teamId } });
    return team;
  }

  async leaveTeam(userId: number, teamId: number) {
    await this.prisma.userTeam.deleteMany({ where: { userId, teamId } });
    return;
  }

  async updateTeam(id: number, body: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: { users: { select: { userId: true } } },
    });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    if (body.parentTeamId) {
      const parentTeam = await this.prisma.team.findUnique({
        where: { id: body.parentTeamId },
        include: {
          subTeams: {
            where: {
              name: body.name,
            },
          },
        },
      });
      if (!parentTeam) {
        throw new NotFoundException('Родительская команда не найдена.');
      }
      if (parentTeam.subTeams.length > 0) {
        throw new ForbiddenException('Конфликт имен команд.');
      }
    }

    const updated = await this.prisma.team.update({
      where: { id },
      data: {
        description: body.description,
        name: body.name,
        parentTeamId: body.parentTeamId ? body.parentTeamId : undefined,
        curatorId: body.curatorId ? body.curatorId : undefined,
        subTeams: body.subTeams
          ? { connect: body.subTeams.map((e) => ({ id: e })) }
          : undefined,
      },
    });

    if (body.curatorId && team.users.find((e) => e.userId === body.curatorId)) {
      await this.prisma.userTeam.deleteMany({
        where: {
          userId: body.curatorId,
          teamId: id,
        },
      });
    }

    return updated;
  }

  async curatorRemove(teamId: number, sessionInfo: GetSessionInfoDto) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        curatorSpecs: {
          select: {
            specId: true,
          },
        },
      },
    });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    if (sessionInfo.role !== 'admin') {
      const accessibleTeamIds = await this.usersAccessService.findAllowedTeams(
        sessionInfo.id,
      );
      if (
        !accessibleTeamIds.includes(teamId) ||
        team.curatorId === sessionInfo.id
      ) {
        throw new ForbiddenException('У вас нет доступа к этой команде.');
      }
    }

    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        curatorId: null,
        users: {
          create: {
            userId: team.curatorId,
          },
        },
        curatorSpecs: {
          deleteMany: {
            teamId,
          },
        },
      },
    });
    await this.prisma.specsOnUserTeam.createMany({
      data: team.curatorSpecs.map((spec) => ({
        teamId,
        userId: team.curatorId,
        specId: spec.specId,
      })),
    });
    return;
  }

  async setCurator(
    teamId: number,
    curatorId: number,
    sessionInfo: GetSessionInfoDto,
  ) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        curatorSpecs: true,
      },
    });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    if (sessionInfo.role !== 'admin') {
      const accessibleTeamIds = await this.usersAccessService.findAllowedTeams(
        sessionInfo.id,
      );
      if (
        !accessibleTeamIds.includes(teamId) ||
        team.curatorId === sessionInfo.id
      ) {
        throw new ForbiddenException('У вас нет доступа к этой команде.');
      }
    }

    const specs = await this.prisma.specsOnUserTeam.findMany({
      where: { teamId, userId: curatorId },
    });

    const specsToAdd = specs
      .map((spec) => spec.specId)
      .filter((spec) => !team.curatorSpecs.find((e) => e.specId === spec));
    const specsToDelete = team.curatorSpecs
      .map((spec) => spec.specId)
      .filter((spec) => !specs.find((e) => e.specId === spec));

    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        curatorId,
        users: {
          deleteMany: {
            userId: { equals: curatorId },
            teamId: { equals: teamId },
          },

          ...(team.curatorId
            ? {
                create: {
                  userId: team.curatorId,
                },
              }
            : {}),
        },
        curatorSpecs: {
          createMany: {
            data: specsToAdd.map((specId) => ({
              specId,
            })),
          },
          deleteMany: {
            specId: { in: specsToDelete },
          },
        },
      },
    });

    if (team.curatorId) {
      await this.prisma.specsOnUserTeam.createMany({
        data: team.curatorSpecs.map((spec) => ({
          teamId,
          userId: team.curatorId,
          specId: spec.specId,
        })),
      });
    }

    return;
  }

  async remove(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }
    await this.prisma.team.delete({ where: { id } });
    return;
  }
  async setTeamUserSpecs(
    { specs, teamId, userId, curator }: SetTeamUserSpecs,
    sessionInfo: GetSessionInfoDto,
  ) {
    const filters = { id: teamId } as Prisma.TeamWhereUniqueInput;

    if (sessionInfo.role !== 'admin') {
      const accessibleTeamIds = await this.usersAccessService.findAllowedTeams(
        sessionInfo.id,
      );
      if (!accessibleTeamIds.includes(teamId)) {
        throw new ForbiddenException('У вас нет доступа к этой команде.');
      }
    }

    // Проверяем, существует ли команда
    const team = await this.prisma.team.findUnique({
      where: filters,
      include: {
        curatorSpecs: true,
      },
    });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    let currentSpecs;
    if (curator) {
      currentSpecs = team.curatorSpecs.map((spec) => spec.specId);
    } else {
      // Получаем текущие спецификации пользователя в команде
      const userTeam = await this.prisma.userTeam.findUnique({
        where: { userId_teamId: { userId, teamId } },
        include: { specs: true }, // Включаем связанные спецификации
      });

      if (!userTeam) {
        throw new NotFoundException('Пользователь не состоит в команде.');
      }

      currentSpecs = userTeam.specs.map((spec) => spec.specId);
    }

    // Определяем, какие спецификации нужно добавить
    const specsToAdd = specs.filter((spec) => !currentSpecs.includes(spec));

    // Определяем, какие спецификации нужно удалить
    const specsToRemove = currentSpecs.filter((spec) => !specs.includes(spec));

    if (specsToRemove.length > 0) {
      if (curator) {
        await this.prisma.curatorSpecs.deleteMany({
          where: {
            teamId,
            specId: { in: specsToRemove },
          },
        });
      } else {
        // Удаляем лишние спецификации
        await this.prisma.specsOnUserTeam.deleteMany({
          where: {
            teamId,
            userId,
            specId: { in: specsToRemove },
          },
        });
      }
    }

    if (curator) {
      await this.prisma.curatorSpecs.createMany({
        data: specsToAdd.map((specId) => ({
          specId,
          teamId,
        })),
      });
      return;
    }

    const data = specsToAdd.map((specId) => ({
      teamId,
      specId,
      userId,
    }));

    if (data.length > 1) {
      await this.prisma.specsOnUserTeam.createMany({
        data,
      });
    } else if (data.length > 0) {
      await this.prisma.specsOnUserTeam.create({
        data: data[0],
      });
    }

    return;
  }

  async addTeamUsers(
    teamId: number,
    userIds: number[],
    sessionInfo: GetSessionInfoDto,
  ) {
    const filters = { id: teamId } as Prisma.TeamWhereUniqueInput;

    if (sessionInfo.role !== 'admin') {
      const accessibleTeamIds = await this.usersAccessService.findAllowedTeams(
        sessionInfo.id,
      );
      if (!accessibleTeamIds.includes(teamId)) {
        throw new ForbiddenException('У вас нет доступа к этой команде.');
      }
    }

    const team = await this.prisma.team.findUnique({ where: filters });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new NotFoundException(
        'Один или несколько пользователей не найдены.',
      );
    }

    const data = userIds.map((userId) => ({
      teamId,
      userId,
    }));
    console.log(data);

    await this.prisma.userTeam.createMany({
      data,
    });

    return;
  }

  async removeTeamUsers(
    teamId: number,
    userId: number,
    sessionInfo: GetSessionInfoDto,
  ) {
    const filters = { teamId, userId } as Prisma.UserTeamWhereInput;

    if (sessionInfo.role !== 'admin') {
      const accessibleTeamIds = await this.usersAccessService.findAllowedTeams(
        sessionInfo.id,
      );
      if (!accessibleTeamIds.includes(teamId)) {
        throw new ForbiddenException('У вас нет доступа к этой команде.');
      }
      // const team = await this.prisma.team.findUnique({
      //   where: { id: teamId }
      // });
      // if (team.curatorId === sessionInfo.id) throw new ForbiddenException('У вас нет доступа к этой команде.');
    }

    return this.prisma.userTeam.deleteMany({
      where: filters,
    });
  }
}
