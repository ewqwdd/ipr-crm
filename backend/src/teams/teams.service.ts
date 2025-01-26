import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { UpdateTeamDto } from './dto/update-team.dto';

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
            user: { select: { avatar: true, id: true, username: true } },
          },
        },
        curator: { select: { avatar: true, id: true, username: true } },
      },
    });
    return teams;
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({ where: { id }, include: {
      users: true,
      curator: true,
    } });
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
      data: { curatorId: null },
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
}
