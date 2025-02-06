import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SetTeamUserSpecs } from './dto/set-team-user-specs';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(
    name: string,
    description?: string,
    parentId?: number,
    curatorId?: number,
  ) {
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
        users: {
          select: {
            user: {
              select: {
                avatar: true,
                id: true,
                username: true,
                specsOnTeams: {
                  select: { specId: true },
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
        users: {
          select: {
            userId: true,
            teamId: true,
            user: {
              select: {
                specId: true,
                specsOnTeams: { where: { teamId: id } },
                username: true,
                avatar: true,
              },
            },
          },
        },
        curator: true,
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
    console.log(userId, teamId);
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

    const updated = await this.prisma.team.update({
      where: { id },
      data: {
        ...body,
        curatorId: body.curatorId ? body.curatorId : undefined,
        users: {
          deleteMany: {
            userId: { equals: body.curatorId },
            teamId: { equals: id },
          },
        },
        subTeams: body.subTeams
          ? { deleteMany: {}, connect: body.subTeams.map((e) => ({ id: e })) }
          : undefined,
      },
    });
    return updated;
  }

  async curatorRemove(teamId: number) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
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
      },
    });
    return;
  }

  async setCurator(teamId: number, curatorId: number) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }
    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        curatorId,
        users: {
          deleteMany: {
            userId: { equals: curatorId },
            teamId: { equals: teamId },
          },
          create: {
            userId: team.curatorId,
          },
        },
      },
    });
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
  async setTeamUserSpecs({ specs, teamId, userId }: SetTeamUserSpecs) {
    // Проверяем, существует ли команда
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Команда не найдена.');
    }

    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    // Получаем текущие спецификации пользователя в команде
    const userTeam = await this.prisma.userTeam.findUnique({
      where: { userId_teamId: { userId, teamId } },
      include: { specs: true }, // Включаем связанные спецификации
    });

    if (!userTeam) {
      throw new NotFoundException('Пользователь не состоит в команде.');
    }

    const currentSpecs = userTeam.specs.map((spec) => spec.specId);

    // Определяем, какие спецификации нужно добавить
    const specsToAdd = specs.filter((spec) => !currentSpecs.includes(spec));

    // Определяем, какие спецификации нужно удалить
    const specsToRemove = currentSpecs.filter((spec) => !specs.includes(spec));

    if (specsToRemove.length > 0) {
      // Удаляем лишние спецификации
      await this.prisma.specsOnUserTeam.deleteMany({
        where: {
          teamId,
          userId,
          specId: { in: specsToRemove },
        },
      });
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

  async addTeamUsers(teamId: number, userIds: number[]) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
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
}
