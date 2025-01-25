import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { PasswordService } from 'src/utils/password/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private prismaService: PrismaService,
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Почта или пароль указаны не верно.');
    }

    const hash = await this.passwordService.getHash(password);

    if (hash !== user.passwordHash) {
      throw new UnauthorizedException('Почта или пароль указаны не верно.');
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      {
        secret: process.env.SECRET_KEY,
      },
    );

    return { token, user: { ...user, passwordHash: null } };
  }

  async getSesssionInfo(id: number) {
    const user = await this.usersService.findOne(id);
    return user;
  }
}
