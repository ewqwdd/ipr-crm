import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/db/prisma.service';
import { CreateUserDto } from './dto/create-user.fto';
import { PasswordService } from 'src/utils/password/password';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { role: true, Spec: true },
      omit: { roleId: true, specId: true },
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, Spec: true },
      omit: { passwordHash: true, roleId: true, specId: true },
    });
    return user;
  }

  async create(data: CreateUserDto) {
    const passwordHash = await this.passwordService.getHash(data.password);
    const userData = { ...data, passwordHash };
    delete userData.password;
    const user = await this.prisma.user.create({ data: userData });

    return { ...user, passwordHash: null };
  }

  async findAll({ page = 1, limit = 10 }) {
    const users = await this.prisma.user.findMany({
      include: { role: true, Spec: true },
      omit: { passwordHash: true, roleId: true, specId: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    const count = await this.prisma.user.count();
    return { users, count };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('id указан неправильно.');
    }
    await this.prisma.user.update({ where: { id }, data: { ...updateUserDto } });
    return { message: 'Пользователь обновлен.' };
  }
}
