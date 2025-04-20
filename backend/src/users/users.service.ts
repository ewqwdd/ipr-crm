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
import { nanoid } from 'nanoid';
import { Workbook } from 'exceljs';
import { CreateMultipleUsersDto } from './dto/create-multiple-users.dto';

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
        Spec: {
          where: {
            archived: false,
          },
        },
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
        Spec: {
          where: {
            archived: false,
          },
        },
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
      roleId: data.roleId || 2,
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
        Spec: {
          where: {
            archived: false,
          },
        },
        teams: {
          select: { teamId: true, team: { select: { name: true } } },
        },
        teamCurator: {
          select: { id: true, name: true },
        },
      },
      omit: { authCode: true, passwordHash: true, roleId: true, specId: true },
      orderBy: { createdAt: 'desc' },
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
      specId ? this.prisma.spec.findUnique({ where: { id: specId } }) : null,
      this.prisma.role.findUnique({ where: { id: roleId } }),
    ]);

    if (!roleExists) throw new NotFoundException('Role не найден.');

    if (specId && specExists) {
      updates.Spec = { connect: { id: specId } };
    }
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

    if (updates.password) {
      const passwordHash = await this.passwordService.getHash(updates.password);
      updates.passwordHash = passwordHash;
      delete updates.password;
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

    let username = data.email.split('@')[0];
    const withUsername = await this.prisma.user.findFirst({
      where: { username },
    });

    if (withUsername) {
      username = nanoid(6);
    }

    const authCode = Math.random().toString(36).substring(2, 15);
    const hashed = await this.passwordService.getHash(authCode);

    const created = await this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.name,
        lastName: data.surname,
        roleId: 2,
        username,
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

  async importUsers(file: Express.Multer.File) {
    const workbook = new Workbook();
    await workbook.xlsx.load(file.buffer);

    const specs = await this.prisma.spec.findMany({
      where: { archived: false },
    });
    const teams = await this.prisma.team.findMany();

    const worksheet = workbook.worksheets[0]; // Первый лист

    const headers: string[] = [];
    const rows: Record<string, any>[] = [];
    const newTeams: string[] = [];
    const newSpecs: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const values = row.values as (string | null)[];

      // Строка заголовков
      if (rowNumber === 1) {
        for (let i = 1; i < values.length; i++) {
          headers.push((values[i] ?? '').toString().trim());
        }
      } else {
        const rowObj: Record<string, any> = {};
        for (let i = 1; i < values.length; i++) {
          const key = headers[i - 1];
          rowObj[key] = values[i];
        }
        rows.push(rowObj);
        const spec = rowObj['Направление'].trim();
        const team = rowObj['Департамент'].trim();
        if (
          spec &&
          !newSpecs.includes(spec) &&
          !specs.find((s) => s.name === spec)
        ) {
          newSpecs.push(spec);
        }
        if (
          team &&
          !newTeams.includes(team) &&
          !teams.find((t) => t.name === team)
        ) {
          newTeams.push(team);
        }
      }
    });

    return { data: rows, specs: newSpecs, teams: newTeams };
  }

  async createMultipleUsers(dto: CreateMultipleUsersDto) {
    return await this.prisma.$transaction(async (tx) => {
      const users = dto.users.map((u) => ({
        ...u,
        email: u.email.toLowerCase(),
        username: u.username.toLowerCase(),
        team: u.team?.trim(),
        spec: u.spec?.trim(),
      }));

      const emails = users.map((u) => u.email);
      const usernames = users.map((u) => u.username);
      const teams = [
        ...new Set(users.map((u) => u.team).filter((v) => v && v !== '-')),
      ];
      const specs = [
        ...new Set(users.map((u) => u.spec).filter((v) => v && v !== '-')),
      ];

      const [existingUsers, existingTeams, existingSpecs] = await Promise.all([
        tx.user.findMany({
          where: {
            OR: [{ email: { in: emails } }, { username: { in: usernames } }],
          },
        }),
        tx.team.findMany({ where: { name: { in: teams } } }),
        tx.spec.findMany({ where: { name: { in: specs }, archived: false } }),
      ]);

      const existingEmails = new Set(existingUsers.map((u) => u.email));
      const existingUsernames = new Set(existingUsers.map((u) => u.username));

      const newUsers = users.filter(
        (u) =>
          !existingEmails.has(u.email) && !existingUsernames.has(u.username),
      );

      const existingTeamNames = new Set(existingTeams.map((t) => t.name));
      const existingSpecNames = new Set(existingSpecs.map((s) => s.name));

      const newTeamNames = [
        ...new Set(
          newUsers
            .map((u) => u.team)
            .filter((t) => t && !existingTeamNames.has(t)),
        ),
      ];
      const newSpecNames = [
        ...new Set(
          newUsers
            .map((u) => u.spec)
            .filter((s) => s && !existingSpecNames.has(s)),
        ),
      ];

      const [createdTeams, createdSpecs] = await Promise.all([
        tx.team.createManyAndReturn({
          data: newTeamNames.map((name) => ({ name })),
          skipDuplicates: true,
        }),
        tx.spec.createManyAndReturn({
          data: newSpecNames.map((name) => ({ name })),
          skipDuplicates: true,
        }),
      ]);

      const allTeams = [...existingTeams, ...createdTeams];
      const allSpecs = [...existingSpecs, ...createdSpecs];

      const createdUsers = await tx.user.createManyAndReturn({
        data: newUsers.map((u) => {
          const spec = allSpecs.find((s) => s.name === u.spec);
          return {
            email: u.email,
            username: u.username,
            roleId: 2,
            specId: spec?.id ?? null,
          };
        }),
        skipDuplicates: true,
      });

      const createdUserMap = new Map(
        createdUsers.map((u) => [u.email.toLowerCase(), u.id]),
      );

      await tx.userTeam.createManyAndReturn({
        data: newUsers
          .filter((u) => u.team)
          .map((u) => {
            const team = allTeams.find((t) => t.name === u.team);
            return {
              userId: createdUserMap.get(u.email),
              teamId: team.id,
            };
          }),
        skipDuplicates: true,
      });

      await tx.specsOnUserTeam.createMany({
        data: newUsers
          .filter((u) => u.team && u.spec)
          .map((u) => {
            const team = allTeams.find((t) => t.name === u.team);
            const spec = allSpecs.find((s) => s.name === u.spec);
            return {
              userId: createdUserMap.get(u.email),
              teamId: team.id,
              specId: spec.id,
            };
          }),
        skipDuplicates: true,
      });

      return createdUsers;
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }
    await this.prisma.user.delete({ where: { id } });
    return user;
  }
}
