import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './utils/db/prisma.service';
import { CookieService } from './utils/cookie/cookie.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordService } from './utils/password/password';
import { UniversalModule } from './universal/universal.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), AuthModule, UsersModule, UniversalModule, UniversalModule],
  controllers: [],
  providers: [PrismaService, CookieService, JwtService, PasswordService],
})
export class AppModule {}
