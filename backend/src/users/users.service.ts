import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateUserDto } from './dto/create-user.fto';
import { PasswordService } from 'src/utils/password/password';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDTO } from './dto/invite-user.dto';
import { MailService } from 'src/utils/mailer/mailer';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private mailService: MailService,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        role: true,
        Spec: true,
        notifications: {
          where: {
            watched: false,
          },
        },
        teams: {
          select: { teamId: true, team: { select: { name: true } } },
        },
        teamCurator: {
          select: { id: true, name: true },
        },
      },
      omit: { roleId: true, specId: true, authCode: true },
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        Spec: true,
        notifications: {
          where: {
            watched: false,
          },
        },
        teams: {
          select: { teamId: true, team: { select: { name: true } } },
        },
        teamCurator: {
          select: { id: true, name: true },
        },
      },
      omit: { passwordHash: true, roleId: true, specId: true, authCode: true },
    });
    return user;
  }

  async create(data: CreateUserDto) {
    const passwordHash = await this.passwordService.getHash(data.password);
    const userData = {
      ...data,
      passwordHash,
      teams: { createMany: { data: data.teams.map((t) => ({ teamId: t })) } },
    };
    delete userData.password;
    const user = await this.prisma.user.create({ data: userData });

    return { ...user, passwordHash: null };
  }

  async findAll({ page, limit }: { page?: number; limit?: number }) {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
        Spec: true,
        teams: {
          select: { teamId: true, team: { select: { name: true } } },
        },
        teamCurator: {
          select: { id: true, name: true },
        },
      },
      omit: { authCode: true, passwordHash: true, roleId: true, specId: true },
      take: limit,
      skip: page ? (page - 1) * limit : undefined,
    });
    const count = await this.prisma.user.count();
    return { users, count };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('id указан неправильно.');
    }

    const { roleId, specId, teams, ...rest } = updateUserDto;
    const updates: any = { ...rest };

    // Validate spec and role
    const [specExists, roleExists] = await Promise.all([
      this.prisma.spec.findUnique({ where: { id: specId } }),
      this.prisma.role.findUnique({ where: { id: roleId } }),
    ]);

    if (!specExists) throw new NotFoundException('Spec не найден.');
    if (!roleExists) throw new NotFoundException('Role не найден.');

    updates.Spec = { connect: { id: specId } };
    updates.role = { connect: { id: roleId } };

    // teams that user is not in and not a curator of
    const curatorAt = user.teamCurator.map((t) => t.id);
    const teamIdsToAdd = teams.filter(
      (teamId) =>
        !user.teams.some((ut) => ut.teamId === teamId) &&
        !curatorAt.includes(teamId),
    );
    // teams that user is in but not in the list
    const teamIdsToRemove = user.teams
      .map((ut) => ut.teamId)
      .filter((teamId) => !teams.includes(teamId));

    if (teamIdsToAdd.length) {
      updates.teams = {
        ...updates.teams,
        createMany: {
          data: teamIdsToAdd.map((teamId) => ({ teamId })),
        },
      };
    }

    if (teamIdsToRemove.length) {
      updates.teams = {
        ...updates.teams,
        deleteMany: {
          teamId: { in: teamIdsToRemove },
        },
      };
    }

    // Update user
    return await this.prisma.user.update({
      where: { id },
      data: updates,
    });
  }

  async invite(data: InviteUserDTO) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (user) {
      throw new ForbiddenException(
        'Пользователь с таким email уже существует.',
      );
    }

    const authCode = Math.random().toString(36).substring(2, 15);
    const hashed = await this.passwordService.getHash(authCode);

    const created = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.name,
        lastName: data.surname,
        roleId: 2,
        username: data.email.split('@')[0],
        authCode: hashed,
      },
    });

    await this.mailService.sendInviteEmail(data.email, created);
    return;
  }

  async passwordReset(authCode: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { authCode },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    const passwordHash = await this.passwordService.getHash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, authCode: null },
    });

    return;
  }
}
