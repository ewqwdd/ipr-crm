import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from 'src/utils/cookie/cookie.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/utils/password/password';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/utils/db/prisma.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
      global: true,
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieService,
    JwtService,
    PasswordService,
    PrismaService,
  ],
})
export class AuthModule {}
