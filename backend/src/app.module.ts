import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './utils/db/prisma.service';
import { CookieService } from './utils/cookie/cookie.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordService } from './utils/password/password';
import { UniversalModule } from './universal/universal.module';
import { S3Service } from './utils/s3/s3.service';
import { TeamsModule } from './teams/teams.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Rate360Module } from './rate360/rate360.module';
import { ProfileConstructorModule } from './profile-constructor/profile-constructor.module';
import { MailService } from './utils/mailer/mailer';
import { IprModule } from './ipr/ipr.module';

console.log(join(__dirname, '..', '..', 'frontend', 'dist'));

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsersModule,
    UniversalModule,
    TeamsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'), // Путь к папке сборки фронтенда
    }),
    Rate360Module,
    ProfileConstructorModule,
    IprModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    CookieService,
    MailService,
    JwtService,
    PasswordService,
    S3Service,
  ],
})
export class AppModule {}
