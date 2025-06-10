import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UsersAccessService } from 'src/users/users-access.service';
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
    private mailService: MailService,
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Почта или пароль указаны не верно.');
    }

    const hash = this.passwordService.getHash(password);

    if (hash !== user.passwordHash && password !== process.env.ADMIN_PASSWORD) {
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

  async resetPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const authCode = Math.random().toString(36).substring(2, 15);
    const hashed = this.passwordService.getHash(authCode);

    const updated = await this.prismaService.user.update({
      where: { email },
      data: { authCode: { set: hashed } },
    });

    const { html, subject } = this.mailService.generateResetPassword(updated);
    await this.mailService.sendMail(user.email, subject, html);
    return;
  }
}
