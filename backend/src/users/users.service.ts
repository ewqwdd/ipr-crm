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
import { Workbook } from 'exceljs';
import { CreateMultipleUsersDto } from './dto/create-multiple-users.dto';
import { CreateProductsService } from './create-products.service';
import { UsersAccessService } from './users-access.service';
import { MailService } from 'src/mail/mail.service';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { UpdateSelfUserDto } from './dto/update-self-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private mailService: MailService,
    private createProductsService: CreateProductsService,
    private usersAccessService: UsersAccessService,
    private filesService: FilesService,
  ) {}

  deputyInclude: Prisma.UserInclude = {
    deputyRelationsAsDeputy: {
      select: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    },
    deputyRelationsAsUser: {
      select: {
        deputy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    },
  };

  defaultInclude: Prisma.UserInclude = {
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
    specsOnTeams: {
      select: {
        spec: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    ...this.deputyInclude,
  };

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { email: email.toLowerCase() }] },
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
    if (!user) throw new NotFoundException('Пользователь не найден.');
    const teamAccess = await this.usersAccessService.findAllowedTeams(
      { email: user.email, id: user.id, role: user.role.name },
      true,
    );
    const userAccess = await this.usersAccessService.findAllowedSubbordinates(
      user.id,
      true,
    );

    return { ...user, teamAccess, userAccess };
  }

  async findOne(id: number, includeAccess = false) {
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
        ...this.deputyInclude,
      },
      omit: { passwordHash: true, roleId: true, specId: true, authCode: true },
    });
    if (!includeAccess) return user;

    const teamAccess = await this.usersAccessService.findAllowedTeams(
      { email: user.email, id: user.id, role: user.role.name },
      true,
    );
    const userAccess = await this.usersAccessService.findAllowedSubbordinates(
      user.id,
      true,
    );

    return { ...user, teamAccess, userAccess };
  }

  async create(data: CreateUserDto) {
    const passwordHash = await this.passwordService.getHash(data.password);
    const userData = {
      ...data,
      email: data.email.toLowerCase(),
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
      include: this.defaultInclude,
      omit: { authCode: true, roleId: true, specId: true },
      orderBy: { id: 'desc' },
      take: limit,
      skip: page ? (page - 1) * limit : undefined,
    });
    const count = await this.prisma.user.count();
    return {
      users: users.map((u) => ({
        ...u,
        passwordHash: undefined,
        access: !!u.passwordHash,
      })),
      count,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('id указан неправильно.');
    }

    await this.usersAccessService.removeRedisTeamsCache(user.id);

    const { roleId, specId, teams, ...rest } = updateUserDto;
    const updates: any = { ...rest };

    const [specExists, roleExists] = await Promise.all([
      specId ? this.prisma.spec.findUnique({ where: { id: specId } }) : null,
      this.prisma.role.findUnique({ where: { id: roleId } }),
    ]);

    if (!roleExists) throw new NotFoundException('Role не найден.');

    if (rest.avatar && user.avatar) {
      await this.filesService.deleteFile(user.avatar);
    }

    if (specId && specExists) {
      updates.Spec = { connect: { id: specId } };
    }
    updates.role = { connect: { id: roleId } };

    const curatorAt = user.teamCurator.map((t) => t.id);
    const teamIdsToAdd = teams.filter(
      (teamId) =>
        !user.teams.some((ut) => ut.teamId === teamId) &&
        !curatorAt.includes(teamId),
    );
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
      const passwordHash = this.passwordService.getHash(updates.password);
      updates.passwordHash = passwordHash;
      delete updates.password;
    }

    return await this.prisma.user.update({
      where: { id },
      data: updates,
      include: this.defaultInclude,
    });
  }

  async updateSelf(id: number, updateUserDto: UpdateSelfUserDto) {
    await this.usersAccessService.removeRedisTeamsCache(id);

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
      username = Date.now().toString();
    }

    const authCode = Math.random().toString(36).substring(2, 15);
    const hashed = this.passwordService.getHash(authCode);

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

    const { html, subject } = this.mailService.generateInvite(created);
    await this.mailService.sendMail(data.email, subject, html);
    return;
  }

  async resendInvite(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (user.authCode) {
      const { html, subject } = this.mailService.generateInvite(user);
      return await this.mailService.sendMail(user.email, subject, html);
    }

    const authCode = Math.random().toString(36).substring(2, 15);
    const hashed = this.passwordService.getHash(authCode);

    await this.prisma.user.update({
      where: { id },
      data: { authCode: hashed },
    });

    const { html, subject } = this.mailService.generateInvite({
      ...user,
      authCode: hashed,
    });
    return await this.mailService.sendMail(user.email, subject, html);
  }

  async passwordReset(authCode: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { authCode },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    const passwordHash = this.passwordService.getHash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, authCode: null },
    });

    return;
  }

  async importUsers(file: Express.Multer.File) {
    const workbook = new Workbook();
    await workbook.xlsx.load(file.buffer);

    const teams = await this.prisma.team.findMany();

    const worksheet = workbook.worksheets[0];

    const headers: string[] = [];
    const rows: Record<string, any>[] = [];
    const newProducts: string[] = [];
    const newDepartments: string[] = [];
    const newDirections: string[] = [];
    const newGroups: string[] = [];

    const findParent = (
      team?: { parentTeamId?: number; id: number; name: string },
      name?: string,
    ) =>
      team?.parentTeamId &&
      teams.find((t) => t.id === team.parentTeamId && t.name === name);

    worksheet.eachRow((row, rowNumber) => {
      const values = row.values as (string | null)[];

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
        const product = rowObj['Продукт']?.trim();
        const direction = rowObj['Направление']?.trim();
        const department = rowObj['Департамент']?.trim();
        const group = rowObj['Группа']?.trim();

        if (
          product &&
          !newProducts.includes(product) &&
          !teams.find((s) => s.name === product && s.parentTeamId === null)
        ) {
          newProducts.push(product);
        }

        if (
          newDepartments &&
          !newDepartments.includes(department) &&
          !teams.find((s) => s.name === department && findParent(s, product))
        ) {
          newDepartments.push(department);
        }

        if (
          direction &&
          !newDirections.includes(direction) &&
          !teams.find(
            (s) =>
              s.name === direction &&
              findParent(findParent(s, department), product),
          )
        ) {
          newDirections.push(direction);
        }

        if (
          group &&
          !newGroups.includes(group) &&
          !teams.find(
            (s) =>
              s.name === group &&
              findParent(
                findParent(findParent(s, direction), department),
                product,
              ),
          )
        ) {
          newGroups.push(group);
        }
      }
    });

    return {
      data: rows,
      products: newProducts.filter((v) => !!v && v !== '-'),
      departments: newDepartments.filter((v) => !!v && v !== '-'),
      directions: newDirections.filter((v) => !!v && v !== '-'),
      groups: newGroups.filter((v) => !!v && v !== '-'),
    };
  }

  async createMultipleUsers(dto: CreateMultipleUsersDto) {
    const createdUsers = await this.prisma.$transaction(
      async (tx) => {
        const users = dto.users.map((u) => ({
          ...u,
          email: u.email.toLowerCase(),
          username: u.username.toLowerCase(),
        }));

        const emails = users.map((u) => u.email.toLowerCase());
        const usernames = users.map((u) => u.username);
        const teams = [
          ...new Set(
            users
              .flatMap((u) => [u.group, u.department, u.direction, u.product])
              .filter((v) => v && v !== '-'),
          ),
        ];

        const [existingUsers, existingTeams] = await Promise.all([
          tx.user.findMany({
            where: {
              OR: [{ email: { in: emails } }, { username: { in: usernames } }],
            },
          }),
          tx.team.findMany({
            where: { name: { in: teams } },
            include: { parentTeam: { select: { name: true } } },
          }),
        ]);

        const existingEmails = new Set(existingUsers.map((u) => u.email));
        const existingUsernames = new Set(existingUsers.map((u) => u.username));

        const newUsers = users.filter(
          (u) =>
            !existingEmails.has(u.email) && !existingUsernames.has(u.username),
        );

        const products = users.reduce((acc, u) => {
          if (!u.product) return acc;
          if (!acc[u.product]) {
            acc[u.product] = {};
          }
          if (!u.department) return acc;
          if (!acc[u.product][u.department]) {
            acc[u.product][u.department] = {};
          }
          if (!u.direction) return acc;
          if (!acc[u.product][u.department][u.direction]) {
            acc[u.product][u.department][u.direction] = new Set();
          }
          if (!u.group) return acc;
          acc[u.product][u.department][u.direction].add(u.group);
          return acc;
        }, {});

        const productsToCreate = this.createProductsService.getProductsToCreate(
          products,
          existingTeams,
        );
        const departmentsToCreate =
          this.createProductsService.getDepartmentsToCreate(
            products,
            existingTeams,
          );
        const directionsToCreate =
          this.createProductsService.getDirectionsToCreate(
            products,
            existingTeams,
          );

        const groupsToCreate = this.createProductsService.getGroupsToCreate(
          products,
          existingTeams,
        );

        const createdProducts = await tx.team.createManyAndReturn({
          data: productsToCreate.map((name) => ({ name, parentTeamId: null })),
        });

        const productNameToId = new Map();

        createdProducts.forEach((p) => {
          productNameToId.set(p.name, p.id);
        });
        existingTeams
          .filter((t) => !t.parentTeamId)
          .forEach((t) => {
            if (!productNameToId.has(t.name)) {
              productNameToId.set(t.name, t.id);
            }
          });

        const createdDepartments = await tx.team.createManyAndReturn({
          data: Object.keys(departmentsToCreate).flatMap((product) =>
            departmentsToCreate[product].map((name) => {
              return {
                name,
                parentTeamId: productNameToId.get(product),
              };
            }),
          ),
        });

        const departmentKeyToId = new Map();

        createdDepartments.forEach((d) => {
          const productName = Array.from(productNameToId.entries()).find(
            ([name, id]) => id === d.parentTeamId,
          )?.[0];
          if (productName) {
            departmentKeyToId.set(`${productName}:${d.name}`, d.id);
          }
        });

        existingTeams.forEach((team) => {
          if (!team.parentTeamId) return;
          const parentProduct = existingTeams.find(
            (p) => p.id === team.parentTeamId,
          );
          if (!parentProduct || parentProduct.parentTeamId !== null) return;
          departmentKeyToId.set(`${parentProduct.name}:${team.name}`, team.id);
        });

        const createdDirections = await tx.team.createManyAndReturn({
          data: Object.keys(directionsToCreate).flatMap((product) =>
            Object.keys(directionsToCreate[product]).flatMap((department) =>
              directionsToCreate[product][department].map((direction) => ({
                name: direction,
                parentTeamId: departmentKeyToId.get(`${product}:${department}`),
              })),
            ),
          ),
        });

        const directionsKeyToId = new Map();

        createdDirections.forEach((d) => {
          const productName = Array.from(departmentKeyToId.entries()).find(
            ([name, id]) => id === d.parentTeamId,
          )?.[0];
          if (productName) {
            directionsKeyToId.set(`${productName}:${d.name}`, d.id);
          }
        });

        existingTeams.forEach((team) => {
          if (!team.parentTeamId) return;
          const parentDepartment = existingTeams.find(
            (d) => d.id === team.parentTeamId,
          );
          if (!parentDepartment || parentDepartment.parentTeamId === null)
            return;
          const parentProduct = existingTeams.find(
            (p) => p.id === parentDepartment.parentTeamId,
          );
          if (!parentProduct || parentProduct.parentTeamId !== null) return;
          directionsKeyToId.set(
            `${parentProduct.name}:${parentDepartment.name}:${team.name}`,
            team.id,
          );
        });

        const createdGroups = await tx.team.createManyAndReturn({
          data: Object.keys(groupsToCreate).flatMap((product) =>
            Object.keys(groupsToCreate[product]).flatMap((department) =>
              Object.keys(groupsToCreate[product][department]).flatMap(
                (direction) =>
                  groupsToCreate[product][department][direction].map(
                    (group) => ({
                      name: group,
                      parentTeamId: directionsKeyToId.get(
                        `${product}:${department}:${direction}`,
                      ),
                    }),
                  ),
              ),
            ),
          ),
        });

        const groupsKeyToId = new Map();

        createdGroups.forEach((d) => {
          const productName = Array.from(directionsKeyToId.entries()).find(
            ([name, id]) => id === d.parentTeamId,
          )?.[0];
          if (productName) {
            groupsKeyToId.set(`${productName}:${d.name}`, d.id);
          }
        });

        existingTeams.forEach((team) => {
          if (!team.parentTeamId) return;
          const parentDirection = existingTeams.find(
            (d) => d.id === team.parentTeamId,
          );
          if (!parentDirection || parentDirection.parentTeamId === null) return;
          const parentDepartment = existingTeams.find(
            (d) => d.id === parentDirection.parentTeamId,
          );
          if (!parentDepartment || parentDepartment.parentTeamId === null)
            return;
          const parentProduct = existingTeams.find(
            (p) => p.id === parentDepartment.parentTeamId,
          );
          if (!parentProduct || parentProduct.parentTeamId !== null) return;
          groupsKeyToId.set(
            `${parentProduct.name}:${parentDepartment.name}:${parentDirection.name}:${team.name}`,
            team.id,
          );
        });

        const createdUsers = await tx.user.createManyAndReturn({
          data: newUsers.map((u) => {
            return {
              email: u.email,
              username: u.username,
              roleId: 2,
              authCode: this.passwordService.getHash(
                Math.random().toString(36).substring(2, 15),
              ),
            };
          }),
          skipDuplicates: true,
        });

        const createdUserMap = new Map(
          createdUsers.map((u) => [u.email.toLowerCase(), u.id]),
        );

        await tx.userTeam.createManyAndReturn({
          data: newUsers
            .filter(
              (u) => (u.product || u.department || u.direction) && !u.leader,
            )
            .map((u) => {
              let teamId;
              if (u.group && u.direction && u.department && u.product) {
                teamId = groupsKeyToId.get(
                  `${u.product}:${u.department}:${u.direction}:${u.group}`,
                );
              } else if (u.direction && u.department && u.product) {
                teamId = directionsKeyToId.get(
                  `${u.product}:${u.department}:${u.direction}`,
                );
              } else if (u.department && u.product) {
                teamId = departmentKeyToId.get(`${u.product}:${u.department}`);
              } else if (u.product) {
                teamId = productNameToId.get(u.product);
              }
              return {
                userId: createdUserMap.get(u.email),
                teamId: teamId,
              };
            }),
          skipDuplicates: true,
        });

        const leaderUsers = newUsers.filter((u) => u.leader);
        for (const user of leaderUsers) {
          let teamId;
          if (user.group) {
            teamId = groupsKeyToId.get(
              `${user.product}:${user.department}:${user.direction}:${user.group}`,
            );
          } else if (user.direction) {
            teamId = directionsKeyToId.get(
              `${user.product}:${user.department}:${user.direction}`,
            );
          } else if (user.department) {
            teamId = departmentKeyToId.get(
              `${user.product}:${user.department}`,
            );
          } else if (user.product) {
            teamId = productNameToId.get(user.product);
          }
          if (!teamId) continue;
          const team = existingTeams.find((t) => t.id === teamId);
          if (team && team.curatorId) {
            await tx.userTeam.createMany({
              data: {
                userId: createdUserMap.get(user.email),
                teamId: team.id,
              },
              skipDuplicates: true,
            });
          } else {
            await tx.team.update({
              where: { id: teamId },
              data: {
                curatorId: createdUserMap.get(user.email),
              },
            });
          }
        }

        return createdUsers;
      },
      {
        timeout: 640000,
        maxWait: 640000,
      },
    );

    const inviteEmails = createdUsers.map((u) => ({
      to: u.email,
      ...this.mailService.generateInvite(u),
    }));

    await this.mailService.sendBulkMail(inviteEmails);
    return createdUsers;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }
    await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async resendInvitesAll() {
    const users = await this.prisma.user.findMany({
      where: { passwordHash: null },
    });

    const inviteEmails = await Promise.all(
      users.map(async (user) => {
        if (!user.authCode) {
          const authCode = Math.random().toString(36).substring(2, 15);
          const hashed = this.passwordService.getHash(authCode);
          await this.prisma.user.update({
            where: { id: user.id },
            data: { authCode: hashed },
          });
          user.authCode = hashed;
        }
        const { html, subject } = this.mailService.generateInvite(user);
        return { to: user.email, subject, html };
      }),
    );
    console.debug('Resending invite for user:', inviteEmails);

    this.mailService.sendBulkMail(inviteEmails);
  }
}
